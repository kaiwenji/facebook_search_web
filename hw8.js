              window.fbAsyncInit = function() {
                FB.init({
                  appId      : '170475343452686',
                  xfbml      : true,
                  version    : 'v2.8'
                });
                FB.AppEvents.logPageView();
              };

              (function(d, s, id){
                 var js, fjs = d.getElementsByTagName(s)[0];
                 if (d.getElementById(id)) {return;}
                 js = d.createElement(s); js.id = id;
                 js.src = "//connect.facebook.net/en_US/sdk.js";
                 fjs.parentNode.insertBefore(js, fjs);
               }(document, 'script', 'facebook-jssdk'));
            
            angular.module("hw8",["ngAnimate"])
            .controller("mainController",["$scope","$http",function($scope,$http){
                $scope.light=new Array(25);
                for(var i=0;i<25;i++)
                    {
                        $scope.light[i]=false;
                    }
                $scope.inputValue="";
                $scope.address='http://Sample-env.3pegy3jkvm.us-west-2.elasticbeanstalk.com/?input=';
                $scope.next="";
                $scope.prev="";
                $scope.tab=0;
                $scope.result="bad";
                $scope.count=0;
                $scope.tableData="";
                $scope.isProcessed=false;
                $scope.detailProcessed=false;
                $scope.inMain=true;
                $scope.detail_star=false;
                $scope.obj="";
                $scope.rawData="";
                $scope.typeList=['users','pages','events','places','groups'];
                $scope.Curresult;
                var row=function(id,name,pic,type)
                {
                    this.id=id;
                    this.name=name;
                    this.picture=pic;
                    this.type=type;
                }
                row.prototype={id:null,name:null,picture:null,type:null};
                var options = {
                  enableHighAccuracy: false,
                  timeout: 10000,
                  maximumAge: 0
                };

                function success(pos) {
                  var crd = pos.coords;

                  $scope.latitude=crd.latitude;
                  $scope.longitude=crd.longitude;
                };

                function error(err) {
                  console.warn(`ERROR(${err.code}): ${err.message}`);
                };

                navigator.geolocation.getCurrentPosition(success, error, options);
                $scope.time_change=function(time)
                {
                    var a=moment(time);
                    return a.format('YYYY-MM-DD h:mm:ss');
                }
                $scope.select=function(val)
                {
                    $scope.isProcessed=false;
                    $scope.inMain=true;
                    $scope.tab=val;
                    if($scope.tab==5)
                        {
                            $scope.rowData=new Array(localStorage.length);
                            var storage=window.localStorage;
                            for(var i=0;i<storage.length;i++)
                                {
                                    var key=storage.key(i);
                                    var value=storage.getItem(key);
                                    var list=value.split("$");
                                    $scope.rowData[i]=new row(key,list[0],list[1],list[2]);
                                }
                            
                        }
                    else
                    {
                        $scope.prev="";
                        $scope.next="";
                        if($scope.result=="bad")
                            {
                                return;
                            }
                        $scope.tableData=$scope.result[$scope.tab];
                        if("data" in $scope.tableData)
                            {
                                $scope.rowData=$scope.tableData["data"];
                                $scope.update_star();
                                
                                if("paging" in $scope.tableData)
                                    {
                                        if("previous" in $scope.tableData["paging"])
                                            {
                                                $scope.prev=$scope.tableData["paging"]["previous"];
                                            }
                                        if("next" in $scope.tableData["paging"])
                                            {
                                                $scope.next=$scope.tableData["paging"]["next"];
                                            }
                                    }
                                    
                            }
                    }

                };
                $scope.check=function(data,info)
                {
                    if(data!=undefined&&info in data)
                        {
                            if(data[info].data.length==0)
                                {
                                    return true;
                                }
                            return false;
                        }
                    else
                    {
                        return true;
                    }
                }
                $scope.fb_connect=function()
                {
                    var picture="";
                    if($scope.tab==5)
                        {
                            picture=$scope.obj.picture;
                        }
                    else
                    {
                        picture=$scope.obj.picture.data.url;
                    }
                    FB.ui({
                    app_id:170475343452686,
                      method: 'feed',
                      link: window.location.href,
                        picture:picture,
                        name:$scope.obj.name,
                      caption: 'FB SEARCH FROM USC CSCI571',
                    }, function(response){
                         if (response && !response.error_message)
                         {
                             alert("posted successfully");
                         }
                         else
                             {
                                alert("Not posted");
                             }

                    });
                }
                $scope.switch=function(obj)
                {
                    $scope.obj=obj;
                    if(!("type" in $scope.obj))
                        {
                            $scope.obj.type=$scope.tab;
                        }
                    setTimeout(exchange(),500);
                    $scope.detail='http://Sample-env.3pegy3jkvm.us-west-2.elasticbeanstalk.com/?id='+obj.id+'&type='+obj.type;
                    $scope.connect($scope.detail,1);
                    $scope.obj=obj;
                    if(!("type" in $scope.obj))
                        {
                            $scope.obj.type=$scope.tab;
                        }
                    if(localStorage.getItem(obj.id))
                        {
                            $scope.detail_star=true;
                        }
                    else
                    {
                        $scope.detail_star=false;
                    }
                };
                var exchange=function()
                {
                    $scope.inMain=false;
                }
                $scope.isSelected=function(val)
                {
                    return ($scope.tab===val);
                };
                $scope.lighting=function(index,obj){
                    if(localStorage.getItem(obj.id)!=null)
                        {
                            if(index==-1)
                                {
                                    $scope.detail_star=false;
                                }
                            else
                            {
                                $scope.light[index]=false;
                            }
                            localStorage.removeItem(obj.id);
                        }
                    else
                    {
                            if(index==-1)
                            {
                                $scope.detail_star=true;
                                if(typeof obj.picture !='string')
                                    {
                                        localStorage.setItem(obj.id,obj.name+"$"+obj.picture.data.url+"$"+obj.type);    
                                    }
                                else
                                    {
                                        localStorage.setItem(obj.id,obj.name+"$"+obj.picture+"$"+obj.type);
                                    }
                            }
                            else
                            {
                                $scope.light[index]=true;
                                localStorage.setItem(obj.id,obj.name+"$"+obj.picture.data.url+"$"+$scope.tab);
                            }
                    }
                };
                $scope.trash=function(row){
                    localStorage.removeItem(row.id);
                    $scope.select(5);
                };
                $scope.update_star=function(){
                    for(var i=0;i<$scope.rowData.length;i++)
                        {
                            if(localStorage.getItem($scope.rowData[i].id)!=null)
                                {
                                    $scope.light[i]=true;
                                }
                            else
                            {
                                $scope.light[i]=false;
                            }
                        }
                };
                $scope.update=function(Curresult){
                    $scope.prev="";
                    $scope.next="";
                    $scope.isProcessed=false;
                    $scope.tableData=Curresult;
                    if("data" in $scope.tableData)
                        {
                            $scope.rowData=$scope.tableData.data;
                            $scope.result[$scope.tab]=$scope.tableData;
                            $scope.update_star();
                            if("paging" in $scope.tableData)
                                {
                                    if("previous" in $scope.tableData["paging"])
                                    {
                                        $scope.prev=$scope.tableData["paging"]["previous"];
                                    }
                                    if("next" in $scope.tableData["paging"])
                                    {
                                        $scope.next=$scope.tableData["paging"]["next"];
                                    }
                                }
                        }
                };
                $scope.connect=function(address,num)
                {
                    if(address==undefined||address=="")
                        {
                            return;
                        }
                    var input;
                    if(num==0)
                        {
                          $scope.inMain=true;  input=$scope.address+encodeURIComponent(address)+"&latitude="+$scope.latitude+"&longitude="+$scope.longitude;
                            $scope.isProcessed=true;
                        }
                    else{
                        if($scope.inMain==false)
                            {
                               $scope.detailProcessed=true;
                            }
                        input=address;
                    }
                    $scope.prev="";
                    $scope.next="";
                    $.ajax({
                        url:input,
                        dataType:"jsonp"
                    })
                    .then(function(response){
                        $scope.$apply(function(){
                                $scope.isProcessed=false;
                                if(response.name!=undefined){
                                    $scope.result=response.name;
                                    $scope.select($scope.tab);
                                }
                                else if(response.id!=undefined)
                                    {
                                        $scope.detailData=response.id[0];
                                        $scope.detailProcessed=false;
                                    }
                                else
                                {
                                    $scope.update(response);
                                }
                        });
                    },function(response){alert(response.text);$scope.isProcessed=false;$scope.detailProcessed=false;});
                };
                $scope.clear=function(){
                    $scope.inputValue="";
                    $scope.inMain=true;
                    $scope.rowData="";
                    $scope.result="bad";
                    $scope.prev="";
                    $scope.next="";
                    $scope.tab=0;
                };
            }])
            ;