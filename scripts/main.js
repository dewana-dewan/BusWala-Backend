var busarr = [];

function busWala() {
  this.initFirebase();
}

busWala.prototype.initFirebase = function() {
  // body...
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.startListeningUser();
  this.processUserData();
};

busWala.prototype.startListeningUser = function() {
  
  var userdb = this.database.ref('userData');
  var requests = this.database.ref('requests');
  var temp = this;

  userdb.on('child_added', function(snapshot){
      snap = snapshot.val();
      snap['user'] = snapshot.key;
      console.log(snap);
      temp.processUserData(snap);
  });
  
  userdb.on('child_removed', function(snapshot){
      console.log('user child removed');
  });

  requests.on('child_added', function(snapshot){
      temp.processRequest(snapshot);
      temp.removerequest(snapshot.key);
  });

  requests.on('child_removed', function(snapshot){
    console.log('request removed');
  });

};

busWala.prototype.processRequest = function(snapshot){

  temp = this;
  snap = snapshot.val();
  console.log(snapshot.val());
  var busdb = this.database.ref('busData');
  var t = 100;

  for (var i = 0; i < busarr.length; i++) {
    ptr = busarr[i].key.indexOf('|');
    route = busarr[i].key.slice(0,ptr);
    busno = busarr[i].key.slice(ptr + 1);
    console.log(route, snap['name']);
    if(route == snap['name']) {
      if(retmindist(busarr[i], snap, 1000)) {
        console.log('found bus');
        var responsedb = temp.database.ref('response/' + busarr[i].key);
        responsedb.set({
          userid: snap['id'],
          name: route, 
          lat: busarr[i].lat,
          log: busarr[i].log,
          lastupdated: busarr[i].lastupdated
        });
      }
    }
  }
};

busWala.prototype.removerequest = function(key) {
  temp = this;
  requestdb = temp.database.ref('requests/' + key);
  requestdb.set({
    null: null
  });
}

busWala.prototype.processUserData = function(snap) {

  var busdb = this.database.ref('busData');
  temp = this;
  
  busdb.on('child_added', function(snapshot){
      bsnap = snapshot.val();
      bsnap['key'] = snapshot.key;
      flag = 0;
      for (var i = busarr.length - 1; i >= 0; i--) {
        if (busarr[i]['key'] == bsnap['key'])
          flag = 1;
      }
      if(flag == 0)
        busarr.push(bsnap);
      if(snap != null)
        temp.validateData(snap);
  });
};


busWala.prototype.validateData = function (snap) {
    var ubusroute = snap['busroute'];

    for (var i = 0; i < busarr.length ; i++) {
      var ptr = busarr[i].key.indexOf('|');
      route = busarr[i].key.slice(0,ptr);
      busno = busarr[i].key.slice(ptr + 1);
      udata = busarr[i].data;
      
      if(route == ubusroute) {
        console.log(route, busno);
        if( retmindist(snap, busarr[i], 10000) ) {
          if(busarr[i]['data'] == undefined || busarr[i]['data'][(snap['user']).toString()] == null) {
            if(busarr[i]['data'] == undefined)
              busarr[i]['data'] = {};
            busarr[i]['data'][(snap['user']).toString()] = {
              lastupdated: snap['lastupdated'],
              lat: snap['lat'],
              log: snap['log']
            }
          }
          var avglat = 0;
          var avglog = 0;
          var n = 0;
          for (var key in busarr[i]['data']) {
            if(busarr[i]['data'].hasOwnProperty(key))
              if(retmindist(busarr[i]['data'][key], busarr[i], 1000)) {
                avglog += busarr[i]['data'][key]['log'];
                avglat += busarr[i]['data'][key]['lat'];
                n++;
              }
          }
          avglat = avglat / n;
          avglog = avglog / n;

          var busdb = this.database.ref('busData/' + busarr[i].key);
          busdb.set({
            lastupdated: snap.lastupdated,
            lat: avglat,
            log: avglog,
            data: busarr[i]['data']
          });
        }

      }
    }
}  

function retmindist(a, b, dst) {
  if(Math.abs(a['log'] - b['log']) <= dst && Math.abs(a['lat'] - b['lat']) <= dst )
    return true;
  else
    return false;
}

window.onload = function() {
  window.busWala = new busWala();
};