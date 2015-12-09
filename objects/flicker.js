/**
 * Created by raphi on 02.12.2015.
 */

var config = require('../config.js');
function Flicker(strength, bulb) {
    var config = require('../config.js');
    // if we get an json object with all parameters
    if(strength.strength  != undefined && strength.bulb  != undefined  ){
        this.strength = strength.strength;
        var promisedbulb = '';

        var b = strength.bulb;
        if(b.id){
            config.searchBulbById(b.id, function(bulb){
                promisedbulb = bulb;
            });
        }else{
            config.searchBulbById(b, function(bulb){
               if(bulb){
                   promisedbulb = bulb;
               }else{
                   config.searchBulbByName(b, function(bulb){
                      if(bulb){
                          promisedbulb = bulb;
                      }
                       else{
                          throw new Error("Bulb not found");
                      }
                   });
               }
            });
        }
        this.bulb = promisedbulb
    }
    //or just the values
    else {
        this.strength = strength;
        var b = bulb;
        var promisedbulb = '';
        if(b.id){
            config.searchBulbById(b.id, function(bulb){
                promisedbulb = bulb;
            });
        }else {
            config.searchBulbById(b, function (bulb) {
                if (bulb) {
                    promisedbulb = bulb;
                } else {
                    config.searchBulbByLabel(b, function (bulb) {
                        if (bulb) {
                            promisedbulb = bulb;
                        }
                        else {
                            throw new Error("Bulb not found");
                        }
                    });
                }
            });
        }
        this.bulb = promisedbulb;

    }
}

//validate all values, if they are OK. otherwise throw a range-error




module.exports = Flicker;