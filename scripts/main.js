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
  temp = this;
  
  busdb.on('child_added', function(snapshot){
      bsnap = snapshot.val();
      bsnap['key'] = snapshot.key;
      busarr.push(bsnap);
      temp.validateData(snap);
  });
};

busWala.prototype.validateData = function (snap) {
    var ubusroute = snap['busroute'];

    for (var i = 0; i < busarr.length ; i++) {
      var ptr = busarr[i].key.indexOf('|');
      route = busarr[i].key.slice(0,ptr);
      busno = busarr[i].key.slice(ptr + 1);
      console.log(route, busno);
      if(route == ubusroute) {
        if( retmindist(snap, busarr[i], 001000) )

      }
    }
}  

function retmindist(a, b, dst) {
  if(abs(a['long'] - b['long']) <= dst && abs(a['long'] - b['long']) <= dst )
    return true;
}

window.onload = function() {
  window.busWala = new busWala();
};