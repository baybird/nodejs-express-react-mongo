'use strict';

var app; // To declare app as a global variable
var WorkOrder;
/********************* Work order - START *************************/

/******************* List *************************/
var WorkList = React.createClass({
  displayName: 'WorkList',

  getInitialState: function getInitialState() {
    //console.log('getInitialState');
    return {
      items: [],
      apiUrl: '/api'
    };
  },

  sort: function sort(field) {
    if (this.state.hasOwnProperty('sortingKey')) {
      sortingKeyArr = this.state.sortingKey;
    } else {
      var sortingKeyArr = [];
    }

    //  1 to specify ascending order.
    // -1 to specify descending order.
    if (typeof sortingKeyArr[field] == 'undefined') {
      sortingKeyArr[field] = 1;
    } else {

      if (sortingKeyArr[field] == 1) {
        sortingKeyArr[field] = -1;
      } else {
        sortingKeyArr[field] = 1;
      }
    }

    this.setState({
      sortingKey: sortingKeyArr
    });

    var keyword = this.props.keyword;
    var status = this.props.order_status;

    // Call getListApi
    this.apiGetList(keyword, status, field, sortingKeyArr[field]);
  },

  apiGetList: function apiGetList(keyword, status, sortingKey, sortingOrder) {
    // Setting default values
    // By doing it on this way is to suppoert the compatibility in IE
    if (typeof keyword == 'undefined') {
      keyword = null;
    }

    if (typeof status == 'undefined') {
      status = 'all';
    }

    if (typeof sortingKey == 'undefined') {
      sortingKey = 'id';
    }

    if (typeof sortingOrder == 'undefined') {
      sortingOrder = 1;
    }

    var apiUrl = this.state.apiUrl + '/' + status + '/' + sortingKey + '/' + sortingOrder;

    if (keyword) {
      apiUrl += '/' + keyword;
    }

    this.serverRequest = $.get(apiUrl, function (result) {
      this.setState({
        items: result
      });
    }.bind(this));
  },

  updateOrder: function updateOrder(id) {
    //console.log('update '+ id);
    ReactDOM.render(React.createElement(Dialog, { orderId: id, apiGetList: this.apiGetList }), document.getElementById('dialog_area'));
  },

  // Called before rendering on both server and client side.
  componentWillMount: function componentWillMount() {
    //console.log('Will mount');
    this.apiGetList();
  },

  // Called after first render only on the client side.
  componentDidMount: function componentDidMount() {
    //console.log('Did mount');
  },

  // Called as soon as the props are updated.
  componentWillReceiveProps: function componentWillReceiveProps() {
    //console.log('Receive props');
  },

  // Called before rendering.
  componentWillUpdate: function componentWillUpdate() {
    //console.log('Will update');
  },

  // Called after rendering.
  componentDidUpdate: function componentDidUpdate() {
    //console.log('Did update');
  },

  // Called after the component is unmounted from the dom.
  componentWillUnmount: function componentWillUnmount() {
    //console.log('Will unmount');
    this.serverRequest.abort();
  },

  sortingIcon: function sortingIcon(num) {
    if (num == 1) {
      return React.createElement('i', { className: 'fa fa-sort-asc', 'aria-hidden': 'true' });
    } else {
      return React.createElement('i', { className: 'fa fa-sort-desc', 'aria-hidden': 'true' });
    }
  },

  // Rendering HTML
  render: function render() {
    var sortingOrderTicket = React.createElement('i', { className: 'fa fa-sort', 'aria-hidden': 'true' });
    var sortingOrderPriority = React.createElement('i', { className: 'fa fa-sort', 'aria-hidden': 'true' });
    var sortingOrderSubject = React.createElement('i', { className: 'fa fa-sort', 'aria-hidden': 'true' });
    var sortingOrderTime = React.createElement('i', { className: 'fa fa-sort', 'aria-hidden': 'true' });
    var sortingOrderStatus = React.createElement('i', { className: 'fa fa-sort', 'aria-hidden': 'true' });

    if (typeof this.state.sortingKey != 'undefined') {
      if (this.state.sortingKey['id']) {
        sortingOrderTicket = this.sortingIcon(this.state.sortingKey['id']);
      }

      if (this.state.sortingKey['priority']) {
        sortingOrderPriority = this.sortingIcon(this.state.sortingKey['priority']);
      }

      if (this.state.sortingKey['subject']) {
        sortingOrderSubject = this.sortingIcon(this.state.sortingKey['subject']);
      }

      if (this.state.sortingKey['time']) {
        sortingOrderTime = this.sortingIcon(this.state.sortingKey['time']);
      }

      if (this.state.sortingKey['status']) {
        sortingOrderStatus = this.sortingIcon(this.state.sortingKey['status']);
      }
    }

    var that = this;
    return React.createElement(
      'table',
      { className: 'list' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            { onClick: this.sort.bind(null, 'id') },
            'Ticket# ',
            sortingOrderTicket,
            ' '
          ),
          React.createElement(
            'th',
            { onClick: this.sort.bind(null, 'priority') },
            'Priority ',
            sortingOrderPriority
          ),
          React.createElement(
            'th',
            { onClick: this.sort.bind(null, 'subject') },
            'Subject ',
            sortingOrderSubject
          ),
          React.createElement(
            'th',
            { onClick: this.sort.bind(null, 'time') },
            'Time ',
            sortingOrderTime
          ),
          React.createElement(
            'th',
            { onClick: this.sort.bind(null, 'status') },
            'Status ',
            sortingOrderStatus
          ),
          React.createElement('th', null)
        )
      ),
      React.createElement(
        'tbody',
        null,
        this.state.items.map(function (item, key) {
          return React.createElement(
            'tr',
            { key: key },
            React.createElement(
              'td',
              null,
              item._id
            ),
            React.createElement(
              'td',
              null,
              item.priority
            ),
            React.createElement(
              'td',
              null,
              item.subject
            ),
            React.createElement(
              'td',
              null,
              item.duration
            ),
            React.createElement(
              'td',
              null,
              typeof item.status == 'undefined' ? '' : item.status.charAt(0).toUpperCase() + item.status.slice(1),
              ' '
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'button',
                { type: 'button', onClick: that.updateOrder.bind(null, item._id), className: 'btn btn_small' },
                'Modify'
              )
            )
          );
        })
      )
    );
  }
});

/******************* Chat *************************/
var Chat = React.createClass({
  displayName: 'Chat',

  titleClicked: function titleClicked() {
    //console.log('toggle chat window');
    $('#chat_area').slideToggle("slow");
  },

  // send message
  sendchat: function sendchat(e) {
    var msg = $('#chat_input').val();

    socket.emit('send_chat_message', msg);

    $('#chat_history').append('<p class="sent">' + msg + '<p>');

    $('#chat_input').val('');

    e.preventDefault();
  },

  render: function render() {
    return React.createElement(
      'div',
      { id: 'chat_window' },
      React.createElement(
        'div',
        { id: 'chat_window_title', onClick: this.titleClicked },
        React.createElement(
          'span',
          null,
          'Chat'
        ),
        React.createElement(
          'span',
          { id: 'chat_window_icon' },
          '-'
        )
      ),
      React.createElement(
        'div',
        { id: 'chat_area', style: { display: 'none' } },
        React.createElement('div', { id: 'chat_history' }),
        React.createElement(
          'div',
          null,
          React.createElement(
            'form',
            { id: 'chat_form', onSubmit: this.sendchat },
            React.createElement('input', { type: 'text', id: 'chat_input', placeholder: 'Type here...' })
          )
        )
      )
    );
  }
});

/********************* Dialog ****************************/
var Dialog = React.createClass({
  displayName: 'Dialog',

  getInitialState: function getInitialState() {

    var that = this;

    if (this.props.orderId) {
      var orderId = this.props.orderId;

      $.ajax({
        method: "GET",
        url: "/api/get/" + orderId
      }).done(function (ret) {
        //console.log(ret.subject);
        that.refs.id.value = ret._id;
        that.refs.subject.value = ret.subject;
        that.refs.priority.value = ret.priority;
        that.refs.status.value = ret.status;
      });
    }

    return {};
  },

  closeDialog: function closeDialog() {
    $("#dialog").slideToggle(function () {
      $(this).remove();
    });
  },

  openDialog: function openDialog() {
    var that = this;
    $("#dialog").slideToggle(function () {
      //console.log(that.props);
    });
  },

  save: function save() {
    var that = this;

    if (that.refs.id.value == '') {
      // new - post
      $.ajax({
        method: "POST",
        url: "/api/insert",
        data: {
          subject: that.refs.subject.value,
          priority: that.refs.priority.value,
          status: that.refs.status.value
        }
      }).done(function (ret) {
        if (ret.status == true) {
          //WorkOrder.refs.worklist.apiGetList();// Call list api
          that.props.apiGetList();
          that.closeDialog(); // Close dialog
        } else {
          alert(ret.message);
        }
      });
    } else {
      // update - put
      $.ajax({
        method: "PUT",
        url: "/api/update",
        data: {
          id: that.refs.id.value,
          subject: that.refs.subject.value,
          priority: that.refs.priority.value,
          status: that.refs.status.value
        }
      }).done(function (ret) {
        if (ret.status == true) {
          that.props.apiGetList(); // Call list api
          that.closeDialog(); // Close dialog
        } else {
          alert(ret.message);
        }
      });
    }
  },

  // Called after rendering.
  componentDidMount: function componentDidMount() {
    //console.log('Did mount');
    this.openDialog();
  },

  render: function render() {
    console.log(this.props);

    var prioritys = ['Low', 'Medium', 'High'];
    var status = ['Active', 'Closed', 'On hold'];

    return React.createElement(
      'div',
      { id: 'dialog', style: { display: 'none' } },
      React.createElement(
        'div',
        { id: 'dialog_table' },
        React.createElement(
          'div',
          { id: 'dialog_tcell' },
          React.createElement(
            'div',
            { id: 'dialog_box' },
            React.createElement(
              'div',
              { id: 'dialog_header', ref: 'caption' },
              'New work order'
            ),
            React.createElement(
              'div',
              { id: 'dialog_body' },
              React.createElement('input', { type: 'hidden', name: 'id', ref: 'id', value: '' }),
              React.createElement(
                'table',
                null,
                React.createElement(
                  'tbody',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      { width: '25%', style: { textAlign: 'right' }, className: 'caption' },
                      'Subject'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { type: 'text', name: 'subject', style: { width: '300px' }, ref: 'subject', placeholder: 'Enter subject' })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      { style: { textAlign: 'right' }, className: 'caption' },
                      'Priority'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement(
                        'select',
                        { style: { width: '200px' }, ref: 'priority', placeholder: 'Select priority' },
                        React.createElement('option', null),
                        prioritys.map(function (priority, key) {
                          return React.createElement(
                            'option',
                            { key: key, value: priority.toLowerCase() },
                            priority
                          );
                        })
                      )
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      { style: { textAlign: 'right' }, className: 'caption' },
                      'Status'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement(
                        'select',
                        { style: { width: '200px' }, ref: 'status', placeholder: 'Select status' },
                        React.createElement('option', null),
                        status.map(function (status, key) {
                          return React.createElement(
                            'option',
                            { key: key, value: status.toLowerCase() },
                            status
                          );
                        })
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { id: 'dialog_footer' },
              React.createElement(
                'button',
                { type: 'button', className: 'btn', onClick: this.save },
                'Save'
              ),
              React.createElement(
                'button',
                { type: 'button', className: 'btn btn_cancel', onClick: this.closeDialog },
                'Close'
              )
            )
          )
        )
      )
    );
  }
});

var PrograssBar = React.createClass({
  displayName: 'PrograssBar',

  getInitialState: function getInitialState() {
    return {
      width: 0
    };
  },

  setProgress: function setProgress(progress) {
    this.setState({ width: progress });
  },

  componentDidMount: function componentDidMount() {
    var intervalId = setInterval(this.timer, 10);
    this.setState({ intervalId: intervalId });

    //console.log("Start interval");
    //console.log("init. width:" + this.state.width);     
  },

  componentWillUnmount: function componentWillUnmount() {
    //console.log("Remove intervalId");
  },

  timer: function timer() {
    if (this.state.width < 100) {
      this.setState({ width: this.state.width + 1 });
      //console.log("width:" + this.state.width);
    } else {
      clearInterval(this.state.intervalId);
      //console.log("Remove intervalId");
    }
  },

  render: function render() {
    var w = this.state.width;

    if (this.state.width == '100') {
      return React.createElement('div', null);
    } else {
      return React.createElement(
        'div',
        { className: 'prograssBar' },
        React.createElement('div', { className: 'bar', style: { width: w + "%" } })
      );
    }
  }
});

WorkOrder = React.createClass({
  displayName: 'WorkOrder',

  getInitialState: function getInitialState() {
    return {
      keyword: "",
      order_status: "all"
    };
  },
  componentDidUpdate: function componentDidUpdate() {
    //console.log('*** state updated ***');
    //console.log('order_status:'+ this.state.order_status);
  },
  search: function search() {
    var keyword = this.refs.keyword.value;
    var status = this.refs.selected_status.value.toLowerCase();
    //console.log('status:'+ status);

    this.setState({
      keyword: keyword,
      order_status: status
    });

    // Call getListApi in worklist component
    this.refs.worklist.apiGetList(keyword, status);
  },

  addNew: function addNew() {
    //console.log('render dialog');  
    ReactDOM.render(React.createElement(Dialog, { apiGetList: this.refs.worklist.apiGetList }), document.getElementById('dialog_area'));
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'nav',
        null,
        React.createElement(
          'div',
          { style: { width: "100%" } },
          React.createElement('input', { ref: 'keyword', type: 'text', name: 'keyword', id: 'keyword', placeholder: 'Searching work orders', autoComplete: 'off', className: 'input_keyword', onChange: this.search }),
          React.createElement(
            'div',
            { id: 'dropdown' },
            React.createElement(
              'select',
              { onChange: this.search, ref: 'selected_status' },
              React.createElement(
                'option',
                null,
                'All'
              ),
              React.createElement(
                'option',
                null,
                'Active'
              ),
              React.createElement(
                'option',
                null,
                'Closed'
              ),
              React.createElement(
                'option',
                null,
                'On hold'
              )
            )
          ),
          React.createElement(
            'button',
            { type: 'button', id: 'btn_new', onClick: this.addNew, className: 'btn' },
            'New'
          )
        )
      ),
      React.createElement(WorkList, { ref: 'worklist', keyword: this.state.keyword, order_status: this.state.order_status }),
      React.createElement(PrograssBar, { ref: 'prograssBar' }),
      React.createElement(Chat, { ref: 'chatWindow' }),
      React.createElement('div', { id: 'dialog_area' })
    );
  }
});
/********************* Work order - END *************************/

/********************* Description - START *************************/
var Description = React.createClass({
  displayName: 'Description',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(PrograssBar, { ref: 'prograssBar' }),
      React.createElement(
        'div',
        { className: 'description' },
        'This is a demo of single page app that built based on NodeJS, React JS, MongoDB and Express.'
      )
    );
  }
});

/********************* Description - END *************************/

var Demo = React.createClass({
  displayName: 'Demo',


  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        null,
        React.createElement(
          'h1',
          null,
          'MERN Stack'
        ),
        React.createElement(
          'div',
          { className: 'header' },
          React.createElement(
            'ul',
            { className: 'menu' },
            React.createElement(
              'li',
              null,
              React.createElement(
                Link,
                { to: '/workorder' },
                'App'
              )
            ),
            React.createElement(
              'li',
              null,
              React.createElement(
                IndexLink,
                { to: '/Description' },
                'Description'
              )
            )
          )
        )
      ),
      React.createElement(
        'main',
        null,
        this.props.children
      ),
      React.createElement(
        'footer',
        null,
        React.createElement(
          'p',
          null,
          'Powered by Node JS + Express + React + MongoDB'
        ),
        React.createElement(
          'p',
          null,
          'R.T. @ 2016'
        )
      )
    );
  }
});

var _ReactRouter = ReactRouter,
    Router = _ReactRouter.Router,
    Route = _ReactRouter.Route,
    hashHistory = _ReactRouter.hashHistory,
    IndexRoute = _ReactRouter.IndexRoute,
    IndexLink = _ReactRouter.IndexLink,
    Link = _ReactRouter.Link;


app = ReactDOM.render(
// Using browserHistory for removing # from URL 
// Caused problem that can't refresh page.
// history={browserHistory}
React.createElement(
  Router,
  { history: hashHistory },
  React.createElement(
    Route,
    { path: '/', component: Demo },
    React.createElement(IndexRoute, { component: WorkOrder }),
    React.createElement(Route, { path: 'description', component: Description }),
    React.createElement(Route, { path: 'workorder', component: WorkOrder })
  )
), document.getElementById('app'));

// PrograssBar
//var h = setInterval(frame, 10);
var width = 0;

// socket.io
var socket = io();

// receving message
socket.on('send_chat_message', function (msg) {
  console.log('receving...');
  $('#chat_history').append('<p class="received">' + msg + '<p>');
  $('#chat_area').slideDown("slow");
});