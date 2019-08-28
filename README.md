# Ngx Cmd

Command library for Angular

## How to use it

1. import to angular main module `NgxModule` from `@stumpam/ngx-cmd`
2. register command `regCmd('name', () => console.log('name command'))`
3. use command `cmd('name)` -> in console will log `name`
