import type { Core } from '@strapi/strapi';
import {setGlobalDispatcher, ProxyAgent} from 'undici';
import proxy from "node-global-proxy";
import Midjourney from "midjourney-discord-api";

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return {"data": 'Welcome to Strapi 🚀'};
  },
  async sendPrompt(config:any, prompt:string){

    const httpProxy: string = process.env.HTTP_PROXY as string;
    const httpsProxy: string = process.env.HTTPS_PROXY as string;
    if (httpProxy){
      proxy.setConfig({ http: httpProxy, https: httpsProxy });
      proxy.start();
      console.log("user proxy" + httpProxy);
      const restTemplate = new ProxyAgent(process.env.HTTP_PROXY);
      setGlobalDispatcher(restTemplate);
    }

    const client = new Midjourney(config.interaction);
    await client.imagine(prompt);
    const msgs = await client.getMessages({limit:1});
    var imgUrls = [];
    for (const msg of msgs) {
      const component = msg.components[0].components;
      const customId = component[0].custom_id;
      const jobId = customId.split("::")[4];
      console.log(jobId);
      for (var i = 0; i < 4; i++){
        const imgUrl = config.cdnPrefix + "/" + jobId + `/0_${i}.png`
        imgUrls.push(imgUrl);
      }
    }
    return imgUrls;
  },

  async requestMidjourney(ctx) {
    const { body } = ctx.request;
    const data = JSON.parse(body);
    const prompt = data.prompt;
    const prefix = data.prefix;

    const pluginConfig: any = strapi.config.get('plugin::midjourney-strapi-plugin');
    
    const urls = await this.sendPrompt(pluginConfig, prompt);

    return {
      data: {
        message: 'Prompt sent successfully',
        urls:urls,
      }
    };
  }
});

export default service;
