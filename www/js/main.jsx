'use strict';


var app; // To declare app as a global variable

/******************* List *************************/
var WorkList = React.createClass({
  getInitialState : function(){
    //console.log('getInitialState');

    return {
      items:[],
      apiUrl: '/api'
    }
  },

  sort:function(field){  

    if(this.state.hasOwnProperty('sortingKey') ){
      sortingKeyArr = this.state.sortingKey;
    }else{
      var sortingKeyArr = [];
    }


    //  1 to specify ascending order.
    // -1 to specify descending order.

    if(typeof sortingKeyArr[field] == 'undefined'){
      sortingKeyArr[field] = 1
    }else{

      if(sortingKeyArr[field] == 1){
        sortingKeyArr[field] = -1;
      }else{
        sortingKeyArr[field] = 1;
      }
    }

    this.setState({
      sortingKey: sortingKeyArr
    });



    var keyword = app.refs.keyword.value;
    var status  = app.refs.selected_status.value.toLowerCase();

    // Call getListApi
    this.apiGetList(keyword, status, field, sortingKeyArr[field]);

  },

  apiGetList: function(keyword=null, status='all', sortingKey='id', sortingOrder=1){
    var apiUrl=this.state.apiUrl+'/'+status+'/'+sortingKey+'/'+sortingOrder;  ;


    if(keyword){
      apiUrl += '/'+keyword;   
    }



    this.serverRequest = $.get(apiUrl, function (result) {
      this.setState({
        items: result,
      });
    }.bind(this));
  },

  updateOrder: function(id){
    //console.log('update '+ id);
    ReactDOM.render(<Dialog orderId = {id}/>, document.getElementById('dialog_area'));
  },

  // Called before rendering on both server and client side.
  componentWillMount: function(){
    //console.log('Will mount');
    this.apiGetList();
  },

  // Called after first render only on the client side.
  componentDidMount: function() {
    //console.log('Did mount');
  },

  // Called as soon as the props are updated.
  componentWillReceiveProps: function(){
    //console.log('Receive props');
  },

  // Called before rendering.
  componentWillUpdate: function(){
    //console.log('Will update');
  },

  // Called after rendering.
  componentDidUpdate: function(){
    //console.log('Did update');
  },

  // Called after the component is unmounted from the dom.
  componentWillUnmount: function() { 
    //console.log('Will unmount');
    this.serverRequest.abort();
  },

  sortingIcon: function(num){
    if(num==1){
      return (<i className="fa fa-sort-asc" aria-hidden="true"></i>);
    }else{
      return (<i className="fa fa-sort-desc" aria-hidden="true"></i>);
    }
  },

  // Rendering HTML
  render : function(){

    var sortingOrderTicket    = (<i className="fa fa-sort" aria-hidden="true"></i>);
    var sortingOrderPriority  = (<i className="fa fa-sort" aria-hidden="true"></i>);
    var sortingOrderSubject   = (<i className="fa fa-sort" aria-hidden="true"></i>);
    var sortingOrderTime      = (<i className="fa fa-sort" aria-hidden="true"></i>);
    var sortingOrderStatus    = (<i className="fa fa-sort" aria-hidden="true"></i>);


    if(typeof this.state.sortingKey !='undefined'){
      if(this.state.sortingKey['id']){
        sortingOrderTicket = this.sortingIcon(this.state.sortingKey['id']);
      }

      if(this.state.sortingKey['priority']){
        sortingOrderPriority = this.sortingIcon(this.state.sortingKey['priority']);
      }

      if(this.state.sortingKey['subject']){
        sortingOrderSubject = this.sortingIcon(this.state.sortingKey['subject']);
      }

      if(this.state.sortingKey['time']){
        sortingOrderTime = this.sortingIcon(this.state.sortingKey['time']);
      }

      if(this.state.sortingKey['status']){
        sortingOrderStatus = this.sortingIcon(this.state.sortingKey['status']);
      }

    }

    var that = this;
    return (
      <table className='list'>
        <thead>
          <tr>
            <th onClick={this.sort.bind(null,'id')}>Ticket# {sortingOrderTicket} </th>
            <th onClick={this.sort.bind(null,'priority')}>Priority {sortingOrderPriority}</th>
            <th onClick={this.sort.bind(null,'subject')}>Subject {sortingOrderSubject}</th>            
            <th onClick={this.sort.bind(null,'time')}>Time {sortingOrderTime}</th>
            <th onClick={this.sort.bind(null,'status')}>Status {sortingOrderStatus}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {

          this.state.items.map(function(item, key){
            return (
              <tr key={key} >
                <td>{item._id}</td>
                <td>{item.priority}</td>
                <td>{item.subject}</td>
                <td>{item.duration}</td>
                <td>{typeof item.status=='undefined'?'':item.status.charAt(0).toUpperCase() + item.status.slice(1)} </td>
                <td><button type="button" onClick={that.updateOrder.bind(null, item._id)} className="btn btn_small">Modify</button></td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    );
  }
});

/******************* Chat *************************/
var Chat = React.createClass({
  titleClicked: function(){
    //console.log('toggle chat window');
    $('#chat_area').slideToggle("slow");
  },

  // send message
  sendchat: function(e){
    var msg = $('#chat_input').val()

    socket.emit('send_chat_message', msg);

    $('#chat_history').append('<p class="sent">'+msg+'<p>');

    $('#chat_input').val('');

     e.preventDefault();
  },

  render: function() {
    return (
      <div id="chat_window">
        <div id="chat_window_title" onClick={this.titleClicked}>
          <span>Chat</span>
          <span id="chat_window_icon">-</span>
        </div>
        <div id="chat_area" style={{display: 'none'}}>
          <div id="chat_history"></div>
          <div>
            <form id="chat_form" onSubmit={this.sendchat}>
              <input type="text" id="chat_input" placeholder="Type here..."/>
            </form>           
          </div>
        </div>
      </div>
    );
  }
});

/********************* Dialog ****************************/
var Dialog = React.createClass({
  getInitialState : function(){
    var that = this;

    if (this.props.orderId) {
      var orderId = this.props.orderId;

      $.ajax({
        method: "GET",
        url: "/api/get/"+orderId,
      }).done(function(ret){
        //console.log(ret.subject);
        that.refs.id.value = ret._id;
        that.refs.subject.value = ret.subject;
        that.refs.priority.value = ret.priority;
        that.refs.status.value = ret.status;
      })       
    }

    return {};
  },


  closeDialog: function(){
    $( "#dialog" ).slideToggle(function(){
      $(this).remove();
    });
  },

  openDialog: function(){
    var that = this;
    $( "#dialog" ).slideToggle(function(){
      //console.log(that.props);
    });
  },

  save: function(){
    var that = this;

    if (that.refs.id.value=='') { // new - post
      $.ajax({
        method: "POST",
        url: "/api/insert",
        data: { 
          subject: that.refs.subject.value,
          priority: that.refs.priority.value,
          status: that.refs.status.value
        }
      }).done(function(ret){
        if(ret.status==true){
          app.refs.worklist.apiGetList();// Call list api
          that.closeDialog();// Close dialog
        }else{
          alert(ret.message);
        }
      })    
    } else { // update - put
      $.ajax({
        method: "PUT",
        url: "/api/update",
        data: { 
          id: that.refs.id.value,
          subject: that.refs.subject.value,
          priority: that.refs.priority.value,
          status: that.refs.status.value
        }
      }).done(function(ret){
        if(ret.status==true){
          app.refs.worklist.apiGetList();// Call list api
          that.closeDialog();// Close dialog
        }else{
          alert(ret.message);
        }
      })    
    }


  },

  // Called after rendering.
  componentDidMount: function(){
    //console.log('Did mount');
    this.openDialog();
  },

  render: function() {
    var prioritys = ['Low','Medium', 'High'];
    var status    = ['Active','Closed','On hold'];
    

    return (
      <div id="dialog" style={{display:'none'}}>
        <div id="dialog_table">
          <div id="dialog_tcell">
            <div id="dialog_box">
              <div id="dialog_header" ref="caption">New work order</div>
              <div id="dialog_body">
                <input type="hidden" name="id" ref="id" value="" />
                <table>
                  <tbody>
                    <tr>
                      <td width="25%" style={{textAlign: 'right'}} className="caption" >Subject</td>
                      <td><input type="text" name="subject" style={{width:'300px'}} ref="subject" placeholder="Enter subject"/></td>
                    </tr>
                    <tr>
                      <td style={{textAlign: 'right'}} className="caption" >Priority</td>
                      <td>
                        <select style={{width:'200px'}} ref='priority' placeholder="Select priority" >
                          <option></option>
                          {
                            prioritys.map(function(priority, key){
                              return (<option key={key} value={priority.toLowerCase()} >{priority}</option>)
                            })
                          }                          
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td style={{textAlign: 'right'}} className="caption" >Status</td>
                      <td>
                        <select style={{width:'200px'}} ref="status" placeholder="Select status" >
                          <option></option>
                          {
                            status.map(function(status, key){
                              return (<option key={key} value={status.toLowerCase()} >{status}</option>)
                            })
                          }                          
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div id="dialog_footer">
                <button type="button" className="btn" onClick={this.save} >Save</button>
                <button type="button" className="btn btn_cancel" onClick={this.closeDialog} >Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

/********************* App *************************/
var App = React.createClass({
  search: function(){
    var keyword = this.refs.keyword.value;
    var status = this.refs.selected_status.value.toLowerCase();

    // Call getListApi in worklist component
    this.refs.worklist.apiGetList(keyword, status);
  },

  addNew: function(){
    //console.log('render dialog');  
    ReactDOM.render(<Dialog />, document.getElementById('dialog_area'));
  },


  render: function(){
    return (
      <div>
        <nav>
          <div style={{width:"100%"}}>
            <input ref="keyword" type="text" name="keyword" id="keyword" placeholder="Searching work orders" autoComplete="off" className="input_keyword" onChange={this.search} />                      
            <div id="dropdown">
              <select onChange={this.search} ref="selected_status">
                <option>All</option>
                <option>Active</option>
                <option>Closed</option>
                <option>On hold</option>
              </select>
            </div>
            <button type="button" id="btn_new" onClick={this.addNew} className='btn'>New</button>
          </div>       
        </nav>
        <WorkList ref="worklist"/>
        <Chat ref="chatWindow"/>
        <div id="dialog_area"/>
      </div>
    );
  }
});

app = ReactDOM.render(<App />, document.getElementById('app'));

var socket = io();

// receving message
socket.on('send_chat_message', function(msg){
  console.log('receving...');
  
  $('#chat_history').append('<p class="received">'+msg+'<p>');

  $('#chat_area').slideDown("slow");
});
