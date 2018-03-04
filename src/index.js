const Handlebars = require('handlebars');
const fs = require('fs');

const map = {
  String: 'STRING',
  Boolean: 'BOOLEAN',
  Int: 'INTEGER',
  Float: 'FLOAT',
  ID: 'STRING',
};

const type = fs.readFileSync(__dirname + '/type.handlebars', 'utf8');
const toMany = {};
const config = {
  inputType: 'MULTIPLE_FILES',
  templates: {
    type
  },
  flattenTypes: true,
  filesExtension: 'js',
  customHelpers: {
    toMysqlType: field => {
      if (field && field !== '') {
        if (!field.directives) {
          throw new Error(`Invalid context for toMysqlType: ${JSON.stringify(field)}`);
        }
        let result = field.type;

        if (field.directives['column'] && field.directives['column'].dataType) {
          result = field.directives['column'].dataType;
        } else if (map[result]) {
          result = map[result];
        }

        return new Handlebars.SafeString(result);
      }

      return '';
    },
    ifToMany: (context, options) => {
      if (
        context.directives &&
        context.directives['BelongsToMany'] &&
        context.directives['BelongsToMany'].through
      ) {
        const through = context.directives['BelongsToMany'].through;
        if (toMany[through] && toMany[through].length === 2) {
          return options && options.fn
            ? options.fn({
                ...{ through: through, foreignKey: toMany[through][0], otherKey: toMany[through][1] },
                ...context
              })
            : '';
        }
      }

      return options && options.inverse ? options.inverse(context) : '';
    },
    toMany: (context, options) => {
      console.log(toMany);
      console.log(context);
      if (context && context !== '') {
        if (context.directives['BelongsToMany'] && context.directives['BelongsToMany'].through) {
          const through = context.directives['BelongsToMany'].through;
          if (!toMany[through]) toMany[through] = [];
          toMany[through].push(context.name + 'Id');
        }
      }
      return options && options.inverse ? options.inverse(context) : '';
    },
  }
};

module.exports = {
  default: config,
};
