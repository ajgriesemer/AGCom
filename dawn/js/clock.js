$(function(){

	// Cache some selectors

	var clock = $('#clock'),
		alarm = clock.find('.alarm'),
		ampm = clock.find('.ampm');

	var alarmtime = "0100001AM"
	// Map digits to their names (this will be an array)
	var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');

	// This object will hold the digit elements
	var digits = {};

	// Positions for the hours, minutes, and seconds
	var positions = [
		'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
	];

	// Generate the digits with the needed markup,
	// and add them to the clock

	var digit_holder = clock.find('.digits');

	$.each(positions, function(){

		if(this == ':'){
			digit_holder.append('<div class="dots">');
		}
		else{

			var pos = $('<div>');

			for(var i=1; i<8; i++){
				pos.append('<span class="d' + i + '">');
			}

			// Set the digits as key:value pairs in the digits object
			digits[this] = pos;

			// Add the digit elements to the page
			digit_holder.append(pos);
		}

	});

	// Add the weekday names

	var weekday_names = 'MON TUE WED THU FRI SAT SUN'.split(' '),
		weekday_holder = clock.find('.weekdays');

	$.each(weekday_names, function(){
		weekday_holder.append('<span>' + this + '</span>');
	});

	var weekdays = clock.find('.weekdays span');


	// Run a timer every second and update the clock

	(function update_time(){
		if(document.getElementById("showalarm").checked == true){
			digits.h1.attr('class', digit_to_name[alarmtime[0]]);
			digits.h2.attr('class', digit_to_name[alarmtime[1]]);
			digits.m1.attr('class', digit_to_name[alarmtime[2]]);
			digits.m2.attr('class', digit_to_name[alarmtime[3]]);
			digits.s1.attr('class', digit_to_name[alarmtime[4]]);
			digits.s2.attr('class', digit_to_name[alarmtime[5]]);
		
			// The library returns Sunday as the first day of the week.
			// Stupid, I know. Lets shift all the days one position down, 
			// and make Sunday last
		
			var dow = alarmtime[6];
			dow--;
			
			// Sunday!
			if(dow < 0){
				// Make it last
				dow = 6;
			}
		
			// Mark the active day of the week
			weekdays.removeClass('active').eq(dow).addClass('active');
		
			// Set the am/pm text:
			ampm.text(alarmtime[7]+alarmtime[8]);
		}
		else{
			
			// Use moment.js to output the current time as a string
			// hh is for the hours in 12-hour format,
			// mm - minutes, ss-seconds (all with leading zeroes),
			// d is for day of week and A is for AM/PM
		
			var now = moment().format("hhmmssdA");
		
			digits.h1.attr('class', digit_to_name[now[0]]);
			digits.h2.attr('class', digit_to_name[now[1]]);
			digits.m1.attr('class', digit_to_name[now[2]]);
			digits.m2.attr('class', digit_to_name[now[3]]);
			digits.s1.attr('class', digit_to_name[now[4]]);
			digits.s2.attr('class', digit_to_name[now[5]]);
		
			// The library returns Sunday as the first day of the week.
			// Stupid, I know. Lets shift all the days one position down, 
			// and make Sunday last
		
			var dow = now[6];
			dow--;
			
			// Sunday!
			if(dow < 0){
				// Make it last
				dow = 6;
			}
		
			// Mark the active day of the week
			weekdays.removeClass('active').eq(dow).addClass('active');
		
			// Set the am/pm text:
			ampm.text(now[7]+now[8]);
		}
		// Schedule this function to be run again in 1 sec
		setTimeout(update_time, 1000);
			
	})();

    $.widget("sylightsUI.switchButton", {

        options: {
            checked: undefined,			// State of the switch

            show_labels: true,			// Should we show the on and off labels?
            labels_placement: "both", 	// Position of the labels: "both", "left" or "right"
            on_label: "ON",				// Text to be displayed when checked
            off_label: "OFF",			// Text to be displayed when unchecked

            width: 25,					// Width of the button in pixels
            height: 11,					// Height of the button in pixels
            button_width: 12,			// Width of the sliding part in pixels

            clear: true,				// Should we insert a div with style="clear: both;" after the switch button?
            clear_after: null,		    // Override the element after which the clearing div should be inserted (null > right after the button)
            on_callback: undefined,		//callback function that will be executed after going to on state
            off_callback: undefined		//callback function that will be executed after going to off state
        },

        _create: function() {
            // Init the switch from the checkbox if no state was specified on creation
            if (this.options.checked === undefined) {
                this.options.checked = this.element.prop("checked");
            }

            this._initLayout();
            this._initEvents();
        },

        _initLayout: function() {
            // Hide the receiver element
            this.element.hide();

            // Create our objects: two labels and the button
            this.off_label = $("<span>").addClass("switch-button-label");
            this.on_label = $("<span>").addClass("switch-button-label");

            this.button_bg = $("<div>").addClass("switch-button-background");
            this.button = $("<div>").addClass("switch-button-button");

            // Insert the objects into the DOM
            this.off_label.insertAfter(this.element);
            this.button_bg.insertAfter(this.off_label);
            this.on_label.insertAfter(this.button_bg);

            this.button_bg.append(this.button);

            // Insert a clearing element after the specified element if needed
            if(this.options.clear)
            {
                if (this.options.clear_after === null) {
                    this.options.clear_after = this.on_label;
                }
                $("<div>").css({
                    clear: "left"
                }).insertAfter(this.options.clear_after);
            }

            // Call refresh to update labels text and visibility
            this._refresh();

            // Init labels and switch state
            // This will animate all checked switches to the ON position when
            // loading... this is intentional!
            this.options.checked = !this.options.checked;
            this._toggleSwitch();
        },

        _refresh: function() {
            // Refresh labels display
            if (this.options.show_labels) {
                this.off_label.show();
                this.on_label.show();
            }
            else {
                this.off_label.hide();
                this.on_label.hide();
            }

            // Move labels around depending on labels_placement option
            switch(this.options.labels_placement) {
                case "both":
                {
                    // Don't move anything if labels are already in place
                    if(this.button_bg.prev() !== this.off_label || this.button_bg.next() !== this.on_label)
                    {
                        // Detach labels form DOM and place them correctly
                        this.off_label.detach();
                        this.on_label.detach();
                        this.off_label.insertBefore(this.button_bg);
                        this.on_label.insertAfter(this.button_bg);

                        // Update label classes
                        this.on_label.addClass(this.options.checked ? "on" : "off").removeClass(this.options.checked ? "off" : "on");
                        this.off_label.addClass(this.options.checked ? "off" : "on").removeClass(this.options.checked ? "on" : "off");

                    }
                    break;
                }

                case "left":
                {
                    // Don't move anything if labels are already in place
                    if(this.button_bg.prev() !== this.on_label || this.on_label.prev() !== this.off_label)
                    {
                        // Detach labels form DOM and place them correctly
                        this.off_label.detach();
                        this.on_label.detach();
                        this.off_label.insertBefore(this.button_bg);
                        this.on_label.insertBefore(this.button_bg);

                        // update label classes
                        this.on_label.addClass("on").removeClass("off");
                        this.off_label.addClass("off").removeClass("on");
                    }
                    break;
                }

                case "right":
                {
                    // Don't move anything if labels are already in place
                    if(this.button_bg.next() !== this.off_label || this.off_label.next() !== this.on_label)
                    {
                        // Detach labels form DOM and place them correctly
                        this.off_label.detach();
                        this.on_label.detach();
                        this.off_label.insertAfter(this.button_bg);
                        this.on_label.insertAfter(this.off_label);

                        // update label classes
                        this.on_label.addClass("on").removeClass("off");
                        this.off_label.addClass("off").removeClass("on");
                    }
                    break;
                }

            }

            // Refresh labels texts
            this.on_label.html(this.options.on_label);
            this.off_label.html(this.options.off_label);

            // Refresh button's dimensions
            this.button_bg.width(this.options.width);
            this.button_bg.height(this.options.height);
            this.button.width(this.options.button_width);
            this.button.height(this.options.height);
        },

        _initEvents: function() {
            var self = this;

            // Toggle switch when the switch is clicked
            this.button_bg.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                self._toggleSwitch();
                return false;
            });
            this.button.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                self._toggleSwitch();
                return false;
            });

            // Set switch value when clicking labels
            this.on_label.click(function(e) {
                if (self.options.checked && self.options.labels_placement === "both") {
                    return false;
                }

                self._toggleSwitch();
                return false;
            });

            this.off_label.click(function(e) {
                if (!self.options.checked && self.options.labels_placement === "both") {
                    return false;
                }

                self._toggleSwitch();
                return false;
            });

        },

        _setOption: function(key, value) {
            if (key === "checked") {
                this._setChecked(value);
                return;
            }

            this.options[key] = value;
            this._refresh();
        },

        _setChecked: function(value) {
            if (value === this.options.checked) {
                return;
            }

            this.options.checked = !value;
            this._toggleSwitch();
        },

        _toggleSwitch: function() {
            this.options.checked = !this.options.checked;
            var newLeft = "";
            if (this.options.checked) {
                // Update the underlying checkbox state
                this.element.prop("checked", true);
                this.element.change();

                var dLeft = this.options.width - this.options.button_width;
                newLeft = "+=" + dLeft;

                // Update labels states
                if(this.options.labels_placement == "both")
                {
                    this.off_label.removeClass("on").addClass("off");
                    this.on_label.removeClass("off").addClass("on");
                }
                else
                {
                    this.off_label.hide();
                    this.on_label.show();
                }
                this.button_bg.addClass("checked");
                //execute on state callback if its supplied
                if(typeof this.options.on_callback === 'function') this.options.on_callback.call(this);
            }
            else {
                // Update the underlying checkbox state
                this.element.prop("checked", false);
                this.element.change();
                newLeft = "-1px";

                // Update labels states
                if(this.options.labels_placement == "both")
                {
                    this.off_label.removeClass("off").addClass("on");
                    this.on_label.removeClass("on").addClass("off");
                }
                else
                {
                    this.off_label.show();
                    this.on_label.hide();
                }
                this.button_bg.removeClass("checked");
                //execute off state callback if its supplied
                if(typeof this.options.off_callback === 'function') this.options.off_callback.call(this);
            }
            // Animate the switch
            this.button.animate({ left: newLeft }, 250, "easeInOutCubic");
        }

    });

})(jQuery);
