module.exports = {
    name: 'sayhi',
    description: 'Says hi to the argument. Usage: sayhi Paul',
    alias: ['s'],
    run: async toolbox => {
      const {
        parameters,
        print: { info }
      } = toolbox
  
      const name = parameters.first; 
      const second = parameters.second; 
      if(name) info(`I was asked to say hi, ${name}`);
      else info(`It was rude of you to not introduce yourself. Usage: sayhi Yourname`);
      if(second) info(`You even gave your second name, ${name} ${second} that's nice!`);
    }
  }
  