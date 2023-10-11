import CS from '@contentstack/app-sdk'
import _get from 'lodash.get'
import { DateTime } from 'luxon'
import type { ICustomField } from '@contentstack/app-sdk/dist/src/types'
import slugify from 'slugify'

const state = reactive<{
  invalidConfig: boolean
  extensionField?: ICustomField
  config?: IConfig
}>({
  invalidConfig: false,
})

const defaultSlugifyOptions = {
  // replacement: '-', // replace spaces with replacement character, defaults to `-`
  // remove: undefined, // remove characters that match regex, defaults to `undefined`
  lower: true, // convert to lower case, defaults to `false`
  // strict: false, // strip special characters except replacement, defaults to `false`
  // locale: 'vi', // language code of the locale to use
  // trim: true, // trim leading and trailing replacement chars, defaults to `true`
}

export const useContentstackExtension = () => {
  onMounted(async () => {
    try {
      const extension = await CS.init()
      // extension.stack.ContentType
      state.extensionField = extension.location.CustomField ?? undefined
      state.extensionField?.frame.enableAutoResizing()

      state.config = state.extensionField?.fieldConfig as IConfig

      // state.field = state.extensionField?.field.getData() as ISlugField
    } catch (error) {
      console.warn(`Unable to find ContentStack instance.`)
    }
  })

  return {
    state,
    generateSlug,
    entry,
    isNewEntry,
  }
}

const entry = computed(() => ({
  ...state.extensionField?.entry._data,
  ...state.extensionField?.entry._changedData,
}))

const isNewEntry = computed(() => !entry.value.uid)

async function generateSlug() {
  if (!state.config?.fields) return

  const parts = await recursionFields(entry.value, state.config.fields)

  const str = parts.join('/')

  const value = !str.startsWith('/') ? `/${str}` : str

  state.extensionField?.entry
    .getField(state.config.populateField ?? 'url')
    .setData(value)
}

async function getReference(entry: IReference) {
  const { stack } = await CS.init()

  const { entry: _entry } = await stack
    .ContentType(entry._content_type_uid)
    .Entry(entry.uid)
    .fetch()

  return _entry
}

async function recursionFields(entry: any, fields: ISlugField[]) {
  let parts: string[] = []

  for (const field of fields) {
    const pointer = _get(entry, field.id)

    if (field.prependSlash) parts.push('')

    switch (field.type) {
      //
      case 'date':
        const date = new Date(pointer)
        parts.push(
          DateTime.fromJSDate(date).toFormat(field.dateFormat ?? 'yyyy/MM/dd')
        )
        break

      //
      case 'reference':
        const _entry = await getReference(pointer)
        const arr = await recursionFields(_entry, field.fields ?? [])
        parts.push(...arr)
        break

      //
      default:
        const options =
          typeof field.slugify === 'object'
            ? field.slugify
            : defaultSlugifyOptions
        parts.push(field.slugify ? slugify(pointer, options) : pointer)
        break
    }
  }

  return parts
}
