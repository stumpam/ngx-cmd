module.exports = {
  name: 'ngx-cmd',
  preset: 'ts-jest',
  coverageDirectory: '../../coverage/libs/ngx-cmd',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
  moduleNameMapper: {
    // we'll use commonjs version of lodash for tests 👌
    // because we don't need to use any kind of tree shaking right?!
    '^lodash-es$': '<rootDir>/../../node_modules/lodash/index.js'
  },
};
