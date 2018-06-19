import api from "../../services/api.js";
var connection = api();

var mixin = {
    data: function() {
        return {
            serverReply: false,
            datalist: [],
            errorField: "",
            isEmpty: false,
            isVisible: false,
            isDisabled: false
        }
    },
    
    methods: {
        loadData: function(page) {
            this.datalist = [];
            connection.post("/admin/loaddata", {table: page})
                .then( response => {
                    this.serverReply = true;
                    if(!response.data[0]) {
                        this.isEmpty = true;
                        this.datalist = [];
                    }
                    else {
                        this.datalist = response.data;
                        this.isEmpty = false;
                        if(page == "clients" || page == "orders") {
                            this.datalist.forEach( item => {
                            if(item.clocksize == 's')
                                item.clocksize = "маленькие";
                            else if(item.clocksize == 'm')
                                item.clocksize = "средние";
                            else item.clocksize = "большие";
                            item.order_date = item.order_date.slice(0, 10);
                            if(page == "orders")
                                item.order_time = item.order_time.slice(0, 5);
                            });
                        }
                    }
                })
                .catch( error => {
                    this.serverReply = false;
                    console.log(error);
                    alert(error.message);
                })
            },
        
            editRecord: function() {
                this.isVisible = !this.isVisible;
                this.isDisabled = true;
                for (var key in this.datalist[this.number - 1]) {
                    this.toEdit[key] = this.datalist[this.number - 1][key];
                }
            },
        
            checkChanges: function(form) {
                var id, email = "";
                var flag = false;
                var status = true;
                var nameTemplate = /^[а-яА-ЯёЁa-zA-Z\- ]*$/;
                var dateTemplate = /\d{4}-[01]\d-[0-3]/;
                var idTemplate = /^[a-zA-Z0-9]*$/;
                var emailTemplate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
                if('master_id' in form) {
                    id = form.master_id;
                    flag = true;
                } else if('id' in form) {
                    id = form.id;
                    flag = true;
                }
                if('client_email' in form) email = form.client_email;
                else if('email' in form) email = form.email;
                
                if(!form.city || form.city.length > 15 ||  !form.city.match(nameTemplate)) {
                    this.errorField = "'Город'";
                    return status = false;
                }
                
                if(flag) {
                    if(!id.length ||
                    id.length > 4 || !id.match(idTemplate)) {
                        this.errorField = "'ID мастера'";
                        return status = false;
                    }
                }
                
                if(email) {
                    if(email.length < 7 || !email.match(emailTemplate) 
                    || email.length > 30) {
                        this.errorField = "'Email'";
                        status = false;
                    }
                }
                
                if('order_date' in form) {
                    if(!form.order_date.match(dateTemplate)) {
                        this.errorField = "'Дата'";
                        status = false;
                    }
                }
                
                if('name' in form) {
                    if(form.name.length < 3 || form.name.length > 20 || !form.name.match(nameTemplate)) {
                        this.errorField = "'Имя'";
                        return status = false;
                    }
                }
                
                if('surname' in form) {
                   if(form.surname.length < 2 || form.surname.length > 30 || !form.surname.match(nameTemplate)) {
                        this.errorField = "'Фамилия'";
                        return status = false;
                    } 
                }
                
                if('rating' in form) {
                    if(!form.rating) {
                        this.errorField = "'Рейтинг'";
                        status = false;
                    }
                }
                return status;
            },
        
            acceptChanges: function(page) {
                if(!this.checkChanges(this.toEdit)) return;
                this.errorField = "";
                connection.post("/admin/" + page, this.toEdit)
                .then( response => {
                    alert("Запись была обновлена.");
                    this.loadData(page);
                })
                .catch( error => {
                    console.log(error);
                    alert(error.message);
                });
            },
        
            deleteRecord: function(page) {
                connection.post("/admin/deldata", { table: page, value: this.toDelete })
                .then( response => {
                    alert("Выбранные записи были удалены");
                    this.toDelete = [];
                    this.loadData(page);
                })
                .catch( error => {
                    console.log(error);
                    alert(error.message);
                });
            }
        }
};

export default mixin;