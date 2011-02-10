sc_require('data_sources/DataSource');

ThothSC.WebSocketDataSource = ThothSC.DataSource.extend({
   
   ThothURL: '/socket.io/websocket',
   
   shouldReconnect: YES,
   
   reconnectAttempts: 3,
   
   _webSocket: null, // the websocket object will be stored here
   
   connect: function(store,callback){ // we need the store to direct the push traffic to
      var wsURL = ['ws://',this.getConnectUrl()].join("");
      this._webSocket = new WebSocket(wsURL);
      // register callbacks
      this._webSocket.onopen = this.createOnOpenHandler(callback);
      this._webSocket.onmessage = this.createOnMessageHandler();
      this._webSocket.onerror = this.createOnErrorHandler();
      this._webSocket.onclose = this.createOnCloseHandler();
      this.store = store;
   },
   
   disconnect: function(){
     if(this._webSocket) this._webSocket.close();
   },
   
   send: function(val){
      if(this._webSocket && val){
         this._reconnectCount = 0; // reset the counter when being able to send something
         var msg = JSON.stringify(val);
         console.log('Trying to send message: ' + msg);
         this._webSocket.send(msg); // cannot return anything as the calling function is most likely GC'ed already
      }
      else return false;
   },
   
   isLoggingOut: null,
   
   onLogoutSuccess: function(data){
      // function called when logout has been successfull
      // remove user and session information
      SC.RunLoop.begin();
      this.user = null;
      this.sessionKey = null; 
      this.isLoggingOut = true;
      this.disconnect();
      if(this.logOutSuccessCallback) this.logOutSuccessCallback();
      SC.RunLoop.end();
   },
   
   _reconnectCount: 0,
   
   createOnCloseHandler: function(event){
      var me = this;
      return function(event){
         console.log('Websocket: MyonClose: ' + event.toString());
         // don't throw away existing user and session information
         me.isConnected = false;
         if(me.shouldReconnect){
           if(me.sendAuthRequest && !me.isLoggingOut){
             console.log('WebSocket: trying to reconnect...');
             me._reconnectCount += 1;
             if(me._reconnectCount < me.reconnectAttempts){
               me.connect(null,function(){
                 // reauth using auth closure
                 me.sendAuthRequest();
               });               
             }
             else {
               console.log('WebSocket: failed to reconnect after ' + me._reconnectCount + ' times. Reconnect by reloading the app?');
             }
           }
           else console.log('WS Connection closed, you need to reauth to continue...');
         }
         me.isLoggingOut = null; 
      };      
   }
   
});; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('Thoth-SC');