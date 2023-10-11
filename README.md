# Contentstack Slug Generator

Uses specified entry fields to generate a custom URL slug.

## Configuration

```json
// default config
{
  "populateField": "url",
  "fields": []
}
```

```ts
interface IConfig {
  populateField?: string
  fields?: ISlugField[]
}

// keys with a question mark are optional
interface ISlugField {
  id: string // the id of the field

  type?: 'string' | 'date' | 'reference' // default is 'string'

  prependSlash?: boolean // prepend a '/' to the determined value. The final output of all fields will always start with a slash

  /**
   * Luxon date format when type is 'date', default is set to `yyyy/MM/dd`
   * https://moment.github.io/luxon/#/formatting?id=table-of-tokens
   */
  dateFormat?: string //

  /**
   * Slugify options when type is 'string'
   * uses Slugify's default options except 'lower' which is set to true, can be overwritten using an object
   * https://github.com/simov/slugify#options
   */
  slugify?: boolean | object

  fields?: ISlugField[] // recursive fields when type is 'reference'
}
```

## Example

```json
{
  "populateField": "url",
  "fields": [
    { "id": "event[0]", "type": "reference", "fields": [{ "id": "url" }] },
    { "id": "start_date", "type": "date" },
    { "id": "uid" }
  ]
}
```

The example above will determine the following and populate the `url` field with:

`/events/bocc/2023/09/20/bltd01ddfc5cc4c90a1`

- the first referenced entry (index 0, as referenced entries are always in an array) `event[0]` and use the value stored in its `url` field (`/evetns/bocc`)
- the date stored in the `start_date` field (`2023/09/20`)
- and finally the entry's uid (`bltd01ddfc5cc4c90a1`)
