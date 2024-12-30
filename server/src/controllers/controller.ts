import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('midjourney-strapi-plugin')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
 async midjourney(ctx){
    ctx.body = await strapi.plugin('midjourney-strapi-plugin')
    .service('service')
    .requestMidjourney(ctx);
  }
});

export default controller;
