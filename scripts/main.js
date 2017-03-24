var busarr = [];

function busWala() {
  this.initFirebase();
}

busWala.prototype.initFirebase = function() {
  // body...
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.startListeningUser();
};

busWala.prototype.startListeningUser = function() {
  
  var userdb = this.database.ref('userData');
  var temp = this;

  userdb.on('child_added', function(snapshot){
      snap = snapshot.val();
      snap['user'] = snapshot.key;
      console.log(snap);
      temp.processUserData(snap);
  });
  
  userdb.on('child_removed', function(snapshot){
      console.log('child removed');
  });

};

busWala.prototype.processUserData = function(snap) {

  var busdb = this.database.ref('busData');
  
  busdb.on('child_added', function(snapshot){
      console.log(snapshot.key);
      busarr.push(snapshot.val());
      name(snap);
  });
};

function name(snap) {
    for (var i = 0; i < busarr.length ; i++) {
      var route;
      var busNo;

      temp = busarr[i]['key'].indexof('|');
      route = busarr[i]['key'].slice(temp);
      console.log(route);
      // if(findpercentagediff(busarr[i], snpValue) <= 10) {

      // }
  }
}  


window.onload = function() {
  window.busWala = new busWala();
};