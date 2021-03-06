"use strict";

function MyApp(){
	var version = "v1.0";

	function setStatus(message){
		$("#app>footer").text(message);
	}

	this.start = function(){
		$("#app>header").append(version);
		setStatus("ready");
	};

	var MyApp = {
		version: "v1.0",
		setStatus: function(message){
			$("#app>footer").text(message);
		}
		start: function(){
			$("#app>header").append(this.version);
			this.setStatus("ready");
		};
	};
}