function startTour(tourMsgs){
  var tour = introJs().setOptions({ 'skipLabel': 'Skip Tour','doneLabel':'Start!','tooltipClass': 'w3-pale-green w3-center','showStepNumbers':false,'scrollToItem':true,'exitOnOverlayClick':false,'hideNext':true,'hidePrev':true});
  tour.setOptions({
    steps: [
      {
        intro: tourMsgs[0].msg,
        class: 'large-box'
      },
      {
        element: document.querySelector('#options'),
        intro: tourMsgs[1].msg,
        position: "auto"
      },
      {
        element: document.querySelectorAll('#sidePanel')[0],
        intro: tourMsgs[2].msg,
        position: "left"
      },
      {
        element: '#step3',
        intro: tourMsgs[3].msg,
        position: 'bottom'
      },
      {
        element: '#step4',
        intro: tourMsgs[4].msg,
        position: 'auto'
      },
      {
        element: '#helpDropBtn',
        intro: tourMsgs[5].msg,
        position: 'auto'
      },
      {
        element: '#compileButton',
        intro: tourMsgs[7].msg,
        position: 'auto'
      },
      {
        intro: tourMsgs[8].msg,
        class: 'w3-blue'
      }
    ]
  });
  tour.start();
}
