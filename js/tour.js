    var tutorial =  false;
	
	var tour = new Tour({
	name: "Tutorial",
	steps: [
      {
        element: ".tour-step.tour-step-one",
		orphan: true,
		delay: 300,
        placement: "bottom",
		backdrop: false,
        title: "Welcome to Münstory!",
        content: "This tour will guide you through features of this Website we'd like to point out. "
      },
	 {
        element: ".tour-step.tour-step-one",
		orphan: true,
		delay: 400,
        placement: "bottom",
		backdrop: false,
        title: "Welcome to Münstory!",
        content: "This Website runs with leapMotion and Web Speech Recognition. If you have a leap motion and a microphone, please plug them in."
      },
         {
        element: ".tour-step-two",
        placement: "right",
        title: "Gesture panel",
        content: "In this panel you find all gestures and their function listed to interact with the system."
      },
       {
        element: ".tour-step-three",
        placement: "top",
        title: "Speech Recognition",
        content: "Clicking this button will start the Speech Recognition. This only works with Google Chrome! It has startet correctly if you see a red dot up in the tabulator."
      },
	     {
        element: ".tour-step-four",
        placement: "top",
        title: "Speech Recognition box",
        content: "This box delivers you a continous text output of the common commands given by you."
      },
		 {
        element: ".tour-step-five",
        placement: "left",
        title: "Map interaction",
		content: "Besides gesture control, you also can control the map via Speech."
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
        content: "The lower circle is the main menu button. You can control it by saying 'open menu' or 'close menu'. Please open the menu for the following step. ",
		
      },
	    {
        element: ".tour-step-seven",
		orphan: true,
		delay:400,
        placement: "top",
        title: "Main Menu",
        content: "The main menu contains two options. Create a point of interest (landmark) on the left and create a new story on the right. ",
      },
	  	 {
        element: ".tour-step-seven",
		orphan: true,
		delay:400,
        placement: "top",
        title: "Main Menu",
        content: "You can use the 'switch'-gesture to choose one option. Please select the left option to create a new point of interest. After that, proceed with the tutorial.",
      },
	  	 {
        element: ".tour-step-eight",
		orphan: true,
		delay:400,
        placement: "top",
        title: "Main Menu",
        content: "Pinch and hold to drag the marker. Release it on the prefered location to place it there. With the point of interest set a new window will appear, where you can insert your story. Feel free to do so.",
      },
	  	 {
        element: ".tour-step-nine",
		delay:400,
        placement: "left",
        title: "POI Information",
        content: "In this form you can describe your point of interest and add a story to it. You can enter the text via keyboard or dictate it via speech recognition. ",
      },
	    {
        element: ".tour-step-nine",
		delay:400,
        placement: "left",
        title: "POI Information",
        content: "Since this is a tutorial and you propably dont want to create a new point of interest now, feel free to say 'close'.",
      },
	  {
        element: ".tour-step-ten",
		orphan: true,
		delay:400,
        placement: "left",
        title: "Add new story",
        content: "Maybe you want to add a new story to an existing point of interest. Please open the menu again and choose the right option 'create story'.",
      },
	  {
        element: ".tour-step-eleven",
		delay:400,
        placement: "left",
        title: "Add new story",
        content: "In this modal, you can enter the name and a short description of you new story. Say 'next' if you are finished. ",
      },
	  {
        element: ".tour-step-twelve",
		orphan: true,
		delay:400,
        placement: "left",
        title: "Add new story",
        content: "Now you have to choose the point of interest, where you want to add your story to. A new modal will appear for further information.",
      },
	  	  {
        element: ".tour-step-thirteen",
		delay:400,
        placement: "left",
        title: "Enter story information",
        content: "Here you can write down your story, also with an abstract. If you have a multi-part story, you can say 'next' to select another point of interest and add your story there. Otherwise say 'create story'. Since this is a tutorial and you propably dont want to insert a new story now, feel free to say 'cancel'.",
      },
	  	 {
        element: ".tour-step-orphan",
		orphan: true,
		delay:400,
        placement: "left",
        title: "End of story",
        content: "Congratulations! You've made it through the tutorial. We hope we helped you understanding the functionality of this website and we look forward to read your storys!",
      },
	  
	]

    });
	

    // Initialize the tour
    tour.init();
 
	
