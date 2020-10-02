module.exports = {
  name: 'generate',
  description: 'Generates a new component',
  alias: ['g'],
  run: async toolbox => {
    const {
      parameters,
      template: { generate },
      print: { info },
      strings
    } = toolbox

    const componentName = parameters.first
    let getUrl = await toolbox.prompt.ask({"name": "geturl","message": "What is the getUrl?"});
    toolbox.prompt.ask({
      type: 'input',
      name: 'getUrl',
      initial: '/clients/',
      message: 'What is the base getUrl?'
    }).then(async response=>{
      console.log(`Will generate with getUrl ${response.getUrl}`);

      await generate({
        template: 'model.js.ejs',
        target: `${strings.upperFirst(componentName)}/${componentName}-package.js`,
        props: { componentName, getUrl }
      });

      await generate({
        template: 'ReferrersModel.js.ejs',
        target: `${strings.upperFirst(componentName)}/${componentName}Model.js`,
        props: { componentName, getUrl }
      });

    })


    await generate({
      template: 'model.js.ejs',
      target: `models/${componentName}-model.js`,
      props: { componentName, getUrl }
    })

    info(`Generated file at ${componentName}`)
  }
}
