# midjourney-strapi-plugin

## Intergation midjourney to strapi in plugin format
  use the library https://github.com/UrielCh/midjourney-client.git
  
## place this code to src/plugins/

## config
update config/plugins.ts with the code
```ts
export default () => ({
  // ...
  'midjourney-strapi-plugin': {
    enabled: true,
    resolve: './src/plugins/midjourney-strapi-plugin',
    config:{
      "cdnPrefix": "https://cdn.midjourney.com",
      "interaction":"./interaction.txt"  //your discord connection info
    }
  },
  // ...
});
```
```bash
    #in the plugins folder
    npm install -g yalc
    npx @strapi/sdk-plugin init midjourney-strapi-plugin
    npx yalc add --link midjourney-strapi-plugin  
    pnpm install 
    pnpm build
    pnpm watch
    #in the strapi home folder
    pnpm develop 
```
## have fun
