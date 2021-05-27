const command = {
  name: 'restart-frontend-component',
  run: async toolbox => {
    const { print } = toolbox;
    
    //console.log(`toolbox`, toolbox);
    toolbox.prompt.ask({
      type: 'input',
      name: 'username',
      initial: 'Anonymouse fellow',
      message: 'What is your username?'
    }).then(response=>{
      console.log(`Welcome to CLI ${response.username}`);
    }).then(response=>{
      return toolbox.prompt.confirm("Are you sure?","Y");
    }).then(response=>{
      console.log(`He is sure: ${response}`);
    }).then(response=>{
      return toolbox.prompt.ask({
        type: 'select',
        name: 'componenttype',
        message: 'What type of component you want to create?',
        choices: ['Class', 'Function']
      });
    }).then(res=>{
      console.log(`He chose: `, res.componenttype);
    });
    
  }
}

module.exports = command
