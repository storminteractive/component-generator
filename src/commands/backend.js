const chalk = require('chalk');

module.exports = {
  name: 'backend',
  description: 'Generates backend files',
  alias: ['b'],
  
  // crudName, libName

  run: async toolbox => {
    const {
      parameters,
      template: { generate },
      print: { info },
      strings,
      prompt
    } = toolbox

    //const componentName = parameters.first
    /*
    let backendMod = await prompt.ask({"name": "backendMod","message": "What is the module name?"});
    let crudName = `${strings.upperFirst(backendMod)}Crud.js`;
    let libName = `${strings.upperFirst(backendMod)}.js`;
    info(`libName: ${libName}\ncrudName: ${crudName}`);
    return;
    */

   let backendMod;
   let moduleVars = {};

    prompt.ask({
      type: 'input',
      name: 'backendMod',
      initial: 'employees',
      message: 'What is the name of the backend module?'
    }).then(async response=>{
      backendMod = response.backendMod;
      
      moduleVars.backendMod = `${strings.lowerFirst(backendMod)}`;
      moduleVars.crudFile = `${strings.upperFirst(backendMod)}Crud.js`;
      moduleVars.crudClass = `${strings.upperFirst(backendMod)}`;
      moduleVars.crudVar = `${strings.lowerFirst(backendMod)}`;

      moduleVars.libFile = `${strings.upperFirst(backendMod)}.js`;
      moduleVars.libClass = `${strings.upperFirst(backendMod)}Class`;
      moduleVars.libVar = `${strings.lowerFirst(backendMod)}`;
      
      moduleVars.dataModel = `${strings.lowerFirst(backendMod)}`;

      console.log(`Backend module name: ${backendMod}`);
      console.log(moduleVars);

      generate({
        template: 'backend/Crud.ejs',
        target: `${moduleVars.crudFile}`,
        props: { ...moduleVars }
      }).then(res=>{
        info(`Generated backend crud file - ${moduleVars.crudFile}`)
      });

      generate({
        template: 'backend/Lib.ejs',
        target: `${moduleVars.libFile}`,
        props: { ...moduleVars }
      }).then(res=>{
        info(`Generated backend lib file - ${moduleVars.libFile}`)
      });

      info(chalk.yellow(`Add to server.js:\napp.use('/${moduleVars.backendMod}',withAuth,require('./cruds/${moduleVars.crudClass}Crud'));`))

    })


    /*
    await generate({
      template: 'model.js.ejs',
      target: `models/${componentName}-model.js`,
      props: { componentName, getUrl }
    })
    */

    //info(`Generated file backend Crud and Lib - ${backendMod}`)
  }
}
