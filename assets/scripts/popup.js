var TaskList = React.createClass({
    render: function(){
        return <div ref="task_list" className="taskList">
            {this.props.items.map((task, taskIndex) =>
                    <div key={taskIndex} className="TaskItem row">
                        <TaskItem taskName = {task.name} taskHour={task.hour} />
                        <button className="btn btn-danger col-md-4" onClick={this.props.deleteTask}
                                value={taskIndex}>Удалить задачу</button>
                    </div>
            )}
        </div>;
    }
});

var TaskItem = React.createClass({
    render: function(){
        return <div className="taskItem">
            <span className="col-md-5">{this.props.taskName}</span>
            <span className="col-md-2">{this.props.taskHour}</span>
        </div>
    }
});

var tomorValue = '';
var todayValue = '';
var isErorr = false;

var FeedbackList = React.createClass({

    changeTomValue: function(){
        tomorValue = React.findDOMNode(this.refs.tomorrowList).value;
    },

    changeTodayValue: function() {
        todayValue = React.findDOMNode(this.refs.todayList).value;
    },

    render: function(){
        return <div className="feedbackList">
            <div>
                <h3>Комментарий: </h3>
                        <textarea placeholder='Введите коментарии к задачам' ref="todayList"
                                  className="form-control" onChange={this.changeTodayValue}/>
            </div>
            <div>
                <h3>План на завтра: </h3>
                <textarea placeholder='Составте план на завтра' ref="tomorrowList"
                          className="form-control"  onChange={this.changeTomValue}/>
            </div>
        </div>
    }
});

var items = [];
var delThis = 'delThis';

var TableRow = React.createClass({

    getInitialState: function() {
        return {isDel: '', classTPopup: 'hidePopup'}
    },
    onShow: function(){
        this.setState({classTPopup: 'showPopup'})
    },
    onHide : function(){
        this.setState({classTPopup: 'hidePopup'})
    },
    onClick: function(){
        this.setState({checked: event.target.checked});
        if(this.state.checked){
            this.setState({isDel: ''});
        }else{

            this.setState({isDel: 'delThis'});
        }
    },
    render: function(){
        var checked = this.state.checked;
        return <tr  className={this.state.isDel}>
            <td><input onChange = {this.onClick} checked={checked}  type="checkbox" /></td>
            <td>{this.props.idCol}</td>
            <td>{this.props.date}</td>
            <td onClick={this.onShow}>{this.props.taskNumber}</td>
            <TablePopup onHide={this.onHide} classTPop={this.state.classTPopup} />
        </tr>

    }
});

var ControlTable = React.createClass({
    render: function(){
        return(
            <div className = 'controlPanel'>
                <button onClick={this.props.deleteButton} className="btn btn-danger">Удалить</button>
                <button onClick={this.props.showPopup} className='btn btn-success'>Составить отчет</button>
            </div>
        );
    }
});

var Main = React.createClass({
    getInitialState: function() {
        $.ajax({
            url: "/task",
            dataType: "JSON",
            success: function(data){
                console.log(data)
            }
        });
        return {classPopup: 'hidePopup'}
    },
    showPopup: function(){
        this.setState({classPopup: 'showPopup'})
    },
    onHide : function(){
        this.setState({classPopup: 'hidePopup'})
    },
    deleteContent: function() {
        var elements = document.getElementsByClassName('delThis');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    },

    render: function(){
        return (
            <div>
                <h1>Список задач</h1>
                <table className='table table-bordered table-hover '>
                    <tr className="info">
                        <th>#</th>
                        <th>id</th>
                        <th>Дата</th>
                        <th>Кол-во задач открыть отчет</th>
                    </tr>
                    <TableRow />
                </table>
                <ControlTable deleteButton={this.deleteContent} showPopup={this.showPopup}  />
                <Report onHide={this.onHide} classPop={this.state.classPopup} />
            </div>
        )
    }
});

var TablePopup = React.createClass({
    render: function() {
        return (
        <div className={this.props.classTPop}>
            <h1>Информацию по отчету</h1>
                    <p>id=1 date=20.09 number=4</p>
            <h2>Выполнены сегодня:</h2>
            <input className="form-control" type="text" defaultValue="Задание" />
            <input className="form-control" type="text" defaultValue="Задание" />
            <input className="form-control" type="text" defaultValue="Задание" />
            <input className="form-control" type="text" defaultValue="Задание" />
            <h3>Комментарий: </h3>
            <textarea defaultValue='Введите коментарии к задачам' ref="todayList"
                                  className="form-control" />
            <h3>План на завтра: </h3>
            <textarea defaultValue='Составте план на завтра' ref="tomorrowList"
                          className="form-control"  />
            <button type="button" className="btn btn-success
                    btn-lg submitBtn">Сохранить изменения</button>
            <button onClick={this.props.onHide} type="button" className="btn btn-danger hideBtn">Закрыть</button>
        </div>
        );
    }
});

var Report = React.createClass({
    getInitialState: function() {
        return {items}
    },

    deleteTask: function(e) {
        var taskIndex = parseInt(e.target.value, 10);
        this.setState(state => {
            state.items.splice(taskIndex, 1);
            return {items: state.items};
        });
    },

    onChange: function(e) {
        this.setState({task: e.target.value});
    },

    onChangeHour: function(e){
        this.setState({ hour: e.target.value });
    },

    addTask:function (e) {
        if(this.state.task == undefined || this.state.hour == undefined)
        {
            alert("Заполните все поля");
        }else {
            this.setState({
                items: this.state.items.concat({name: this.state.task, hour: this.state.hour}),
                task: undefined,
                hour: undefined
            })
        }

        e.preventDefault();
    },

    onReportSubmit: function() {
        isErorr = false;
        var date = new Date();
        var dateNow = date.toDateString();
        if (todayValue == undefined)
        {
            isErorr = true;
            alert('Дайте коментарии к задачам');
        }
        if (tomorValue == undefined)
        {
            isErorr = true;
            alert('Составте план на завтра');
        }
        if (this.state.items[0] == undefined)
        {
            isErorr = true;
            alert('Добавте выполненые задачаи сегодня');
        }

        if(isErorr == false){
            var summary = {tasks: this.state.items, today: todayValue, tomorrow: tomorValue, date: dateNow};
            var report = JSON.stringify(summary);
            console.log(report);
            $.post('/task', {
                summary
            }, function (res) {
            });
        }
    },

    render: function(){
        return(
                <div className={this.props.classPop}>
                    <h1>Выполнены сегодня:</h1>
                    <TaskList items={this.state.items} deleteTask={this.deleteTask} />
                    <form className="addTaskPanel">
                        <div className="row">
                            <div  className="col-md-5">
                                <input className="inputItem" placeholder="Название задачи" onChange={this.onChange}
                                       type="text" value={this.state.task} id="inputTask"/>
                            </div>
                            <div className="col-md-2">
                                <input ref="val" className="inputItem" placeholder="Время" onChange={this.onChangeHour}
                                       type="text" value={this.state.hour} id="inputHour" />
                            </div>
                            <div className="col-md-1">
                                <button className="btn btn-primary" onClick={this.addTask}>
                                    Добавить задачу</button>
                            </div>
                        </div>
                    </form>
                    <FeedbackList />
                    <button onClick={this.onReportSubmit} type="button" className="btn btn-success
                    btn-lg submitBtn">Отправить отчет</button>
                    <button onClick={this.props.onHide} type="button" className="btn btn-danger hideBtn">Закрыть</button>
                </div>
        );
    }
});




React.render(<Main />, document.getElementById('main'));