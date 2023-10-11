interface ISlugField {
  value: string
}

interface IConfig {
  fields?: ISlugField[]
  populateField?: string
}

interface ISlugField {
  id: string
  type?: 'string' | 'date' | 'reference'
  fields?: ISlugField[]
  dateFormat?: string
  prependSlash?: boolean
  slugify?: boolean | object
}

interface IReference {
  uid: string
  _content_type_uid: string
}
