'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var SteamServerGenerator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('appname', { type: String, required: false, desc: 'Name of the server' });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the Steam dedicated server generator!\n\n' +
      'Brought to you by those crazy gamers at The Times of London!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'serverName',
        message: 'What is your server\'s name?',
        validate: function(input){
          return (input.length < 20 ? true : 'Shorter than 20 chars, please...');
        },
      default: this.appname
      },
      {
        type: 'list',
        name: 'architecture',
        message: 'What architecture and platform are you planning on using?',
        choices: [
          {
            name: '64-bit Linux',
            value: 'AMD64_linux'
          },
          {
            name: '32-bit Linux',
            value: 'i386_linux',
            disabled: 'Not in this release.'
          },
          {
            name: '64-bit Windows',
            value: 'AMD64_windows',
            disabled: 'Nope, not in this release either.'
          },
          {
            name: '64-bit Mac OS X',
            value: 'AMD64_darwin',
            disabled: 'You\'re joking -- right, bruv?'
          }
        ],
        default: 0
      },
      {
        type: 'confirm',
        name: 'isDocker',
        message: 'Do you want this config as a Dockerfile?',
        default: false,
        when: function(answers) {
          return (answers.architecture.match('linux') ? true : false);
        }
      },
      {
        type: 'confirm',
        name: 'isDocker',
        message: 'What about as a Vagrantfile?',
        default: false,
        when: function(answers) {
          return (answers.architecture.match('linux') ? true : false);
        }
      },
      {
        type: 'checkbox',
        name: 'games',
        message: 'Which games would you like to install?',
        choices: [
          {
            value: 'tf2',
            name: 'Team Fortress 2',
            checked: true
          },
          {
            value: 'hl2',
            name: 'Half Life 2 Death Match',
            checked: true
          },
        ]
      }

    ];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.dest.mkdir('app');
      this.dest.mkdir('app/templates');

      this.src.copy('_package.json', 'package.json');
      this.src.copy('_bower.json', 'bower.json');
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = SteamServerGenerator;
