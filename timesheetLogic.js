// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyDErofAFy9o-aYPgELEKpgPieY4vfqC-NM",
  authDomain: "traintime-27dbf.firebaseapp.com",
  databaseURL: "https://traintime-27dbf.firebaseio.com",
  projectId: "traintime-27dbf",
  storageBucket: "traintime-27dbf.appspot.com",
  messagingSenderId: "511819416220"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrainTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;

  var timeLeft = moment().diff(moment.unix(firstTrainTime), "minutes") % frequency;
  var minLeft = frequency - timeLeft;
  var nextArrival = moment().add(minLeft, "m").format("hh:mm A");

  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minLeft)
  );


  $("#train-table > tbody").append(newRow);
});
