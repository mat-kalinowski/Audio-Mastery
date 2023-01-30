var
    mouseY = 0,
    allowMouseMoveOnExternalElements = true,
    mouseKnob = null;

function knobValueBlur(ele) {
    var
        v = ele.innerHTML,
        knob = $(ele).parents('[knob]');

    if (v == '' || isNaN(v)) {
        v = parseInt(knob.attr('value'));
    } else if (parseInt(v) < parseInt(knob.attr('min'))) {
        v = parseInt(knob.attr('min'));
    } else if (parseInt(v) > parseInt(knob.attr('max'))) {
        v = parseInt(knob.attr('max'));
    } else {
        v = parseInt(v);
    }

    ele.innerHTML = v;
    knob.attr('value', v);
    knobUpdate(knob, 'keyboard');
}

function knobValueFocus(ele) {
    ele.innerHTML = '';
}

function knobKeydown(ele, event) {
    if (event.key == 'Enter') {
        $(ele).blur();
        knobValueBlur(ele);
    }
}

function initKnobs() {
    $(window)
        .mousemove(function (e) {
            e.preventDefault();
            mouseY = e.pageY;
            if (mouseKnob != null) {
                knobUpdate(mouseKnob, 'mouse');
                $(mouseKnob).addClass('inaction');
            }
            if (Math.abs($(mouseKnob).attr('y') - mouseY) > 160) {
                $(mouseKnob).attr('start', $(mouseKnob).attr('value'));
                $(mouseKnob).find('.knob-value').attr('reach-limit', 'off');
                mouseKnob = null;
                allowMouseMoveOnExternalElements = true;
                $('.inaction').removeClass('inaction');
            }
        })
        .mousedown(function (e) {
            mouseY = e.pageY;
        })
        .mouseup(function () {
            if (mouseKnob != null) {
                $(mouseKnob).attr('start', $(mouseKnob).attr('value'));
                $(mouseKnob).find('.knob-value').attr('reach-limit', 'off');
            }
            mouseKnob = null;
            allowMouseMoveOnExternalElements = true;
            $('.inaction').removeClass('inaction');
        });
}

function knobBase(ele) {
    if ($(ele).attr('state') != 'disabled') {
        mouseKnob = null;
        $(ele).attr('state', 'inactive');
        $(ele).attr('value', $(ele).attr('base'));
        knobUpdate(ele, 'keyboard');
    }
}

function knobActivate(ele, e) {
    if ($(ele).attr('state') != 'disabled') {
        mouseKnob = ele;
        allowMouseMoveOnExternalElements = false;
        $(ele).attr('state', 'active');
        $(ele).attr('y', mouseY);
    }
}

function knobUpdate(ele, device) {
    var
        angleRange = 280,
        sensitivity = parseFloat($(ele).attr('sensitivity')),
        value = parseFloat($(ele).attr('value')),
        start = parseFloat($(ele).attr('start')),
        min = parseFloat($(ele).attr('min')),
        max = parseFloat($(ele).attr('max')),
        knobValue = $(ele).find('.knob-value'),
        knobController = $(ele).find('.knob-controller');

    knobValue.attr('reach-limit', 'off');
    knobController.attr('reach-limit', 'off');
    if ($(ele).attr('state') == 'active' && device == 'mouse') {
        var
            diffY = ($(ele).attr('y') - mouseY) * sensitivity,
            changedValue = start + diffY;
        if (changedValue <= min) {
            value = min;
        } else if (changedValue >= max) {
            value = max;
        } else {
            value = changedValue;
        }
        if (value == min || value == max) {
            knobValue.attr('reach-limit', 'on');
            knobController.attr('reach-limit', 'on');
        }
    }

    var
        percent = 100 - (max - value) / (max - min) * 100,
        deg = percent * angleRange / 100 - 140;

    $(ele).find('.knob-controller').css('transform', "rotate(" + deg + "deg)");
    $(ele).attr('value', value);
    updateKnobValue(ele, percent);
}