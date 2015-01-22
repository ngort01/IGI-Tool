    var tour = new Tour({
	name: "Tutorial",
	steps: [
      {
        element: ".tour-step.tour-step-one",
		orphan: true,
		delay: 300,
        placement: "bottom",
		backdrop: false,
        title: "Welcome to Projectname!",
        content: "This tour will guide you through some of the features we'd like to point out. This Webtool runs with leapMotion and Google Web Speech Recognition."
      },
         {
        element: ".tour-step-two",
        placement: "right",
        title: "Gesture panel",
        content: "In this panel are all gestures and their functions listed you need to know to interact with the system."
      },
       {
        element: ".tour-step-three",
        placement: "top",
        title: "Speech Recognition",
        content: "By clicking on this link, you will start the Speech Recognition. This only works with Google Chrome!"
      },
	     {
        element: ".tour-step-four",
        placement: "top",
        title: "Speech Recognition box",
        content: "If you are using the speech recognition, these boxes deliver you a continous text output of your speech input. "
      },
		 {
        element: ".tour-step-five",
        placement: "left",
        title: "Map interaction",
		content: "Besides mouse control, you also can control the map via Speech. If you have a microphone, you may start the Speech Recognition."
      },
	     {
        element: ".tour-step-five",
        placement: "left",
        title: "Speech Commands",
		content: "You can control the map with easy commands: 'left', 'right', 'up', 'down', 'zoom in/out'. "
      },
	     {
        element: ".tour-step-five",
        placement: "left",
        title: "Speech Commands",
        content: "On the map you can see landmarks. You can select a landmark either by clicking on it or performing the 'click'-gesture. A selected landmark will show the stories linked to it."
      },
	   	{
        element: ".tour-step-six",
		orphan: true,
		delay: 400,
        placement: "top",
        title: "Main Menu",
        content: "The lower circle is the main menu button. Simply click or perform the 'open Menu' gesture on the circle to open the menu. Then click next. ",
		
      },
	    {
        element: ".tour-step-seven",
		orphan: true,
		delay:400,
        placement: "top",
        title: "Main Menu",
        content: "The main menu contains two options. Create a landmark on the left and create a new story on the right. ",
      },
	  	 {
        element: ".tour-step-seven",
		orphan: true,
		delay:400,
        placement: "top",
        title: "Main Menu",
        content: "You can use the 'switch'-gesture to choose one option. Please select the landmark, by performing the 'landmark'-gesture. After that, please click next.",
      },
	  	 {
        element: ".tour-step-eight",
		orphan: true,
		delay:400,
        placement: "top",
        title: "Main Menu",
        content: "With a click on the desired location via mouse or click-gesture the marker will be placed. With the landmark set a new window will appear, where you can insert your story. Feel free to do so.",
      },
	  	 {
        element: ".tour-step-nine",
		orphan: true,
		delay:400,
        placement: "left",
        title: "POI Information",
        content: "In this form you can describe your landmark and add a story to it. You can enter the text via keyboard or dictate it via speech recognition. ",
      },
	    {
        element: ".tour-step-nine",
		orphan: true,
		delay:400,
        placement: "left",
        title: "POI Information",
        content: "Since this is a tutorial and you propably dont want to create a new landmark, feel free to click 'cancel'",
      }
	  
	]

    });
	

    // Initialize the tour
    tour.init();
 
	
