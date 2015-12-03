/**
 * Created by raphi on 02.12.2015.
 */


function Color(hue, saturation, brightness, kelvin, duration) {
    // if we get an json object with all parameters
    if(hue.hue  != undefined && hue.saturation  != undefined && hue.brightness != undefined ){
        this.hue = hue.hue;
        this.saturation = hue.saturation;
        this.brightness = hue.brightness;
        if(hue.kelvin) {
            this.kelvin = hue.kelvin;
        }
        if(hue.duration){
            this.duration = hue.duration;
        }

    }
    //or just the values
    else {
        this.hue = hue;
        this.saturation = saturation;
        this.brightness = brightness;
        if(this.kelvin) {
            this.kelvin = kelvin;
        }
        if(kelvin) {
            this.kelvin = kelvin;
        }
        if(duration){
            this.duration = duration;
        }
    }
    this.validate();
}

//validate all values, if they are OK. otherwise throw a range-error
Color.prototype.validate = function(err){
    if (typeof this.hue !== 'number' || this.hue < 0 || this.hue > 360) {
       throw new RangeError('LIFX light color method expects hue to be a number between 0 and 360, value is '+ this.hue);
    }

    else if (typeof this.saturation !== 'number' || this.saturation < 0 || this.saturation > 100) {
        throw new RangeError('LIFX light color method expects saturation to be a number between 0 and 100');
    }

    else if (typeof this.brightness !== 'number' || this.brightness < 0 || this.brightness > 100) {
        throw  new RangeError('LIFX light color method expects brightness to be a number between 0 and 100' );
    }

    else if ((typeof this.kelvin !== 'number' && this.kelvin !== undefined) || this.kelvin < 2500 || this.kelvin > 9000){
        throw new RangeError('LIFX light color method expects kelvin to be a number between 2900 and 9000');
    }
    else if (this.duration !== undefined && typeof this.duration !== 'number') {
        err( new RangeError('LIFX light color method expects duration to be a number'));
    }

};



module.exports = Color;