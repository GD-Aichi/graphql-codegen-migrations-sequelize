const Handlebars = require('handlebars');
const fs = require('fs');

const map = {
  String: 'STRING',
  Boolean: 'BOOLEAN',
  Int: 'INTEGER',
  Float: 'FLOAT',
  ID: 'STRING',
};

const type = fs.readdirSync(__dirname + '/type.handlebars', 'utf8');

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
    }
  }
};

module.exports = {
  default: config,
};
