function busWala() {
  this.initFirebase();
}

busWala.prototype.initFirebase = function() {
  // body...
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.startListening();
};

busWala.prototype.startListening = function() {
  var userdb = this.database.ref('data');
  var temp = this;
  userdb.on('child_added', function(snapshot){
      console.log(snapshot.val());
      temp.updateBusdb(snapshot.val());
  });
  userdb.on('child_removed', function(snapshot){

  });
};

busWala.prototype.updateBusdb = function() {
  var busdb = this.database.ref('busData');
  var newbus = busdb.push();
  newbus.set({
    name:"asdf",
    value:"afdsd"
  })
};

window.onload = function() {
  window.busWala = new busWala();
};