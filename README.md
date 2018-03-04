# graphql-codegen-migrations-sequelize
This generator template generate files of sequelize migrations
## Usage
add directives
```graphql
directive @entity on OBJECT
directive @UUID on FIELD_DEFINITION
directive @Column(dataType: String) on FIELD_DEFINITION
directive @BelongsTo(foreignKey: String) on FIELD_DEFINITION
```
run gql-gen
```bash
gql-gen --export ./schem.js -t graphql-codegen-migrations-sequelize --out ./db/migrations/pattern
```
## Example
```graphql
type Post @entity {
  postId: ID @UUID
  autor: User @BelongsTo
  title: String! @Column
  text: String! @Column(dataType: "TEXT")
}
```
output
```js
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('post', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      autorId: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('post');
  }
};
```
## Operations for object
#### @entity
for example:
```graphql
type Post @entity {
  id: ID
  autor: User
}
```
## Fields
### Scalar types
- String -> Sequelize.STRING
- Boolean -> Sequelize.BOOLEAN
- Int -> Sequelize.INTEGER
- Float -> Sequelize.FLOAT
- ID -> Sequelize.STRING
### Field constraints
#### @UUID
for example:
```graphql
type Post @entity {
  postId: @UUID
}
```
output
```js
postId: {
  type: Sequelize.UUID,
  defaultValue: Sequelize.UUIDV4,
  allowNull: false,
}
```
#### @Column(dataType: String)
for example:
```graphql
type Post @entity {
  text: String @entity(dataType: "TEXT")
}
```
output
```js
text: {
  type: Sequelize.TEXT
},
```
#### @BelongsTo(foreignKey: String)
for example:
```graphql
type Post @entity {
  autor: User @BelongsTo
  coautor: User @BelongsTo(foreignKey: "couserId")
}
```
output
```js
autorId: {
  type: Sequelize.INTEGER
},
couserId: {
  type: Sequelize.INTEGER
}
```
