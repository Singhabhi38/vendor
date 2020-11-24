const product_GLOBALS_ProductURL = window.location;
const product_GLOBALS_isDebugMode = product_GLOBALS_ProductURL.search.indexOf("ui_debug=true") > -1;
const product_GLOBALS_isSQLDebugMode = product_GLOBALS_ProductURL.search.indexOf("sql_debug=true") > -1;

// Following done for FILTER
Object.defineProperty(Array.prototype, '__chunk', {
    value: function(chunkSize) {
        var array=this;
        return [].concat.apply([],
            array.map(function(elem,i) {
                return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
            })
        );
    }
});

var app;

(function () {
app = angular.module('app',['ui.router',
    // 'angularTrix',
                      'ngResource',
                      'ngMessages',
                      'ncy-angular-breadcrumb',

                       'ui.calendar',

                       'ngAnimate','ngAria','ngMaterial'])

    .config(function ($httpProvider,$compileProvider) {
        // Reduces digest cycle
        // Each XHR will NOT trigger digest cycle
        $httpProvider.useApplyAsync(true);
        $compileProvider.debugInfoEnabled(false);
    })

    // .config(function($mdThemingProvider) {
        // specify primary color, all
        // $mdThemingProvider.theme('altTheme')
        //     .primaryPalette('blue-grey')

        // other color intentions will be inherited
        // from default
        // $mdThemingProvider.setDefaultTheme('altTheme');
    // })

    . run(['$rootScope',
        function ($rootScope) {

            var activeXHRCount = 0;

            var showXHRUI = function(force){
                if(activeXHRCount > 1 && !force){
                    return;
                }
                document.body.style.cursor = "progress";
                document.getElementById('xhrLayOver').style['display'] = 'block';
            }

            var hideXHRUI = function(force){
                if(activeXHRCount > 1 && !force){
                    return;
                }
                setTimeout(function(){
                    document.body.style.cursor = "default";
                    document.getElementById('xhrLayOver').style['display'] = 'none';
                }, 700);
            }

            $rootScope.$on('product.api.xhr.send', function (event, config) {
                activeXHRCount+=1;
                showXHRUI();
            });

            $rootScope.$on('product.api.xhr.receive', function (event, response) {
                activeXHRCount-=1;
                hideXHRUI();
            });

            $rootScope.$on('product.api.xhr.receive.error', function (event, response) {
                activeXHRCount-=1;
                hideXHRUI();
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                showXHRUI(true);
            });

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                hideXHRUI(true);
                window.scrollTo(0,0);
            });


            //#########################################################################################################
            //
            //  Debugging / Console LOGS API Calls
            //
            if(!product_GLOBALS_isDebugMode){
                return;
            }

            $rootScope.$on('product.api.xhr.send', function (event, configData) {
                console.log("DEBUG :: "+
                    "URL:"+configData.url +
                    " | Method:"+ JSON.stringify(configData.method)+
                    " | Params:"+ JSON.stringify(configData.params === undefined ? "{}" : configData.params) +
                    " | Data:"+ JSON.stringify(configData.data === undefined ? "{}" : configData.data)+
                    " | API Call! --->"
                );
                console.log(configData);
            });

            $rootScope.$on('product.api.xhr.receive', function (event, response) {
                console.log("DEBUG :: "+
                    "URL:"+response.config.url +
                    " | Method:"+ JSON.stringify(response.config.method)+
                    " | Params:"+ JSON.stringify(response.config.params === undefined ? "{}" : response.config.params)+
                    " | API Response! <---"
                );
                // console.log(response);

            });

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                console.log("DEBUG :: "+"State change! "+ "From: " + fromState.name + " To: " +toState.name);
            });
        },

]);

})();

/**
 * Created by sadhikari on 8/14/2016.
 */

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider


        .state('home', {
            url: '/',
            views: {
                '': {templateUrl: 'partial/dashboard'}
            }
        })


        // ATTENDANCE
        .state('takeAttendanceOfCourse', {
            url: '/attendance/take/course/{id}',
            views: {
                '': {templateUrl: 'partial/attendance-form'}
            }
        })

        .state('attendanceCreate', {
            url: '/attendance/create',
            views: {
                '': {templateUrl: 'partial/attendance-form'}
            },
            ncyBreadcrumb: {
                label: 'Create Attendance',
                parent: 'dashboard',

            }
        })

        .state('attendanceListCreate', {
            url: '/attendancelist/create',
            params: {
                stateTitle: 'Create Attendance',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/attendance-form'}
            },
            ncyBreadcrumb: {
                label: 'Create Attendance',

            }
        })

        .state('attendanceListCard', {
            url: '/attendance/report',
            views: {
                '': {templateUrl: 'partial/attendance-list-card'}
            },
            ncyBreadcrumb: {
                label: 'Attendance Report',
                parent: 'attendanceCreate',
            }
        })

        // Room
        .state('roomCreate', {
            url: '/room/create',
            params: {
                stateTitle: 'Create Room',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/room-form'}
            }
        })

        .state('roomListCard', {
            url: '/room/all',
            views: {
                '': {templateUrl: 'partial/room-list-card'}
            }
        })

        .state('roomDetail', {
            url: '/room/{id}/detail',
            params: {
                stateTitle: 'Class Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {templateUrl: 'partial/room-detail'}
            }

        })

        .state('roomEdit', {
            url: '/room/edit/{id}',
            params: {
                stateTitle: 'Edit Room',
                actionParams: {action: 'edit'},
            },
            views: {

                '': {
                    templateUrl: 'partial/room-form',
                },
            }
        })

        // Address
        .state('addressCreate', {
            url: '/address/create',
            params: {
                stateTitle: 'Create Address',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/address-form'}
            }
        })

        .state('addressListCard', {
            url: '/address/all',
            views: {
                '': {templateUrl: 'partial/address-list-card'}
            }
        })

        .state('addressDetail', {
            url: '/address/{id}/detail',
            params: {
                stateTitle: 'Class Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {templateUrl: 'partial/address-detail'}
            }

        })

        .state('addressEdit', {
            url: '/address/edit/{id}',
            params: {
                stateTitle: 'Edit Address',
                actionParams: {action: 'edit'},
            },
            views: {

                '': {
                    templateUrl: 'partial/address-form',
                },
            }
        })


        // COURSE
        .state('courseCreate', {
            url: '/course/create',
            params: {
                stateTitle: 'Create Course',
                actionParams: {action: 'create'},
                productEntity: 'course',
            },
            views: {
                '': {templateUrl: 'partial/course-form'},
                // 'scheduleForm@courseCreate' : {templateUrl: 'partial/schedule-form'}
            },
            ncyBreadcrumb: {
                label:'Create Course',
            },
        })

        .state('courseEdit', {
            url: '/course/edit/{id}',
            params: {
                stateTitle: 'Edit Course',
                actionParams: {action: 'edit'},
                productEntity: 'course',
            },
            ncyBreadcrumb: {
                label:'Edit Course',
                parent: 'courseDetail',
            },
            views: {
                '': {
                    templateUrl: 'partial/course-form',
                    'scheduleForm@courseEdit': {
                        templateUrl: 'partial/schedule-form'
                    }
                },
            }
        })

        .state('courseListCard', {
            url: '/subjects.html',
            ncyBreadcrumb: {
                label: 'Subjects',
                parent: 'dashboard',
            },
            views: {
                '': {templateUrl: 'partial/course-list-card'}
            }
        })

        .state('courseDetail', {
            url: '/course/{id}/detail',
            ncyBreadcrumb: {
                label: '{{course.name}}',
                parent: 'courseListCard',
            },

            params: {
                stateTitle: 'Course Detail',
                actionParams: {action: 'view-detail'},
                productEntity: 'course',
            },
            views: {
                '': {templateUrl: 'partial/course-detail'},
                'attendanceForm@courseDetail': {
                    templateUrl: function ($stateParams) {
                        var entity = "course";
                        return 'partial/attendance-form?forEntity=' + entity + '&forEntityId=' + $stateParams.id;
                    },
                },
                // 'scheduleForm@courseDetail' : {
                //     templateUrl: 'partial/schedule-form',
                // },
                // 'examinationForm@courseDetail' :{
                //     templateUrl: 'partial/examination-form',
                // },
                // 'messageForm@courseDetail':{
                //     templateUrl: 'partial/message-form',
                // }
            }
        })

        .state('courseExamination', {
            url: '/course/{id}/examination',
            views: {
                '': {templateUrl: 'partial/course-examination'},
            },
            ncyBreadcrumb: {
                label:'Examination',
                parent: 'courseDetail',
            }
        })

        .state('courseDiscussion', {
            url: '/course/{id}/discussion',
            views: {
                '': {templateUrl: 'partial/course-discussion'},
            },
            ncyBreadcrumb: {
                label:'Discussion',
                parent: 'courseDetail',
            }
        })

        .state('courseAttendanceReport', {
            url: '/course/{id}/attendance/report',
            views: {
                '': {templateUrl: 'partial/course-attendance-report'},
            }
        })

        .state('courseSchedule', {
            url: '/course/{id}/schedule',
            views: {
                '': {templateUrl: 'partial/course-schedule'},
            }
        })

        .state('assignCourseToUser', {
            url: '/assign/user/{id}/course',
            params: {
                stateTitle: 'Assign course to User',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/assign-course-to-user-form'}
            }
        })

        .state('courseDelete', {
            url: '/course/{id}/delete',
            params: {
                stateTitle: 'Delete Course',
                actionParams: {action: 'delete'},
            },
            views: {
                '': {
                    templateUrl: 'partial/course-delete',
                },
            }
        })

        // DASHBOARD / HOME
        .state('dashboard', {
            url: '/dashboard.html',
            ncyBreadcrumb: {
                label: 'Dashboard',
            },
            views: {
                '': {templateUrl: 'partial/dashboard'}
            }
        })
        //ASSIGNMENT
        .state('assignmentListCard', {
            url: '/assignment/all',
            views: {
                '': {templateUrl: 'partial/assignment-list-card'}
            }
        })

        .state('assignmentDetail', {
            url: '/assignment/detail',
            views: {
                '': {templateUrl: 'partial/assignment-detail'}
            }
        })

        // EXAMINATION
        .state('examinationCreate', {
            url: '/examination/create',
            ncyBreadcrumb: {
                label: 'Create Examination',
            },
            params: {
                stateTitle: 'Create Examination',
                actionParams: {action: 'create'},
            },
            templateUrl: 'partial/examination-form'
        })

        .state('examinationListCard', {
            url: '/examination/all',
            views: {
                '': {templateUrl: 'partial/examination-list-card'}
            },
            ncyBreadcrumb: {
                label: 'All Exam',
            }
        })

        .state('examinationDetail', {
            url: '/examination/{id}/detail',
            params: {
                stateTitle: 'Class Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {templateUrl: 'partial/examination-detail'},
                'attendanceForm@examinationDetail': {
                    templateUrl: function ($stateParams) {
                        var entity = "examination";
                        return 'partial/attendance-form?forEntity=' + entity + '&forEntityId=' + $stateParams.id;
                    },
                },
            },
            ncyBreadcrumb: {
                label:'{{examination.type.name}} - {{examination.name}}',
                parent: 'examinationListCard'
            }
        })
        .state('examinationAttendance', {
            url: '/examination/{id}/attendance/detail',
            params: {
                stateTitle: 'View Attendance',
                actionParams: {action: 'view-attendance'},
            },
            views: {
                '': {templateUrl: 'partial/mainexamination-attendance-detail'},
            }
        })
        .state('examinationAttendanceReport', {
            url: '/examination/{id}/attendance/report',
            views: {
                '': {templateUrl: 'partial/examination-attendance-report'}
            },
            ncyBreadcrumb: {
                label:'Attendance Detail',
                parent: 'examinationDetail',
            }
        })

        .state('examinationEdit', {
            url: '/examination/{id}/edit',
            params: {
                stateTitle: 'Edit Examination',
                actionParams: {action: 'edit'},
            },
            ncyBreadcrumb: {
                label:'Edit Exam',
                parent: 'examinationDetail',
            },
            ncyBreadcrumb: {
                label:'Edit Exam',
                parent: 'examinationDetail',
            },
            views: {
                '': {
                    templateUrl: 'partial/examination-form',
                },
            }
        })

        .state('examinationDelete', {
            url: '/examination/{id}/delete',
            params: {
                stateTitle: 'Delete Examination',
                actionParams: {action: 'delete'},
            },
            views: {
                '': {
                    templateUrl: 'partial/examination-delete',
                },
            }
        })

        .state('examinationDiscussion', {
            url: '/examination/{id}/discussion',
            views: {
                '': {templateUrl: 'partial/examination-discussion'},
            },
            ncyBreadcrumb: {
                label:'Examination Discussion',
                parent: 'examinationDetail',
            }
        })

        // File

        .state('fileUpload', {
            url: '/file/upload',
            views: {
                '': {templateUrl: 'partial/file-upload'}
            }
        })

        .state('fileListCard', {
            url: '/file/all',
            views: {
                '': {templateUrl: 'partial/file-list-card'}
            },
            ncyBreadcrumb: {
                label: 'All Files',
                parent: 'dashboard'
            }

        })

        // GRADE
        .state('gradeCreate', {
            url: '/grade/create',
            params: {
                stateTitle: 'Create Grade',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/grade-form'}
            },
            ncyBreadcrumb: {
                label:'Create Grade',
            },
        })

        .state('assignGradeToUser', {
            url: '/assign/user/{id}/grade-class-level',
            params: {
                stateTitle: 'Assign Grade to User',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/assign-grade-to-user-form'}
            }
        })

        .state('gradeDetail', {
            url: '/grade/{id}/detail',
            ncyBreadcrumb: {
                label: '{{grade.name}}',
                parent: 'gradeListCard'
            },
            params: {
                stateTitle: 'Class Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {
                    templateUrl: 'partial/grade-detail',
                    controller: 'GradeDetailController',
                    resolve: {
                        GradeJSON: function ($stateParams, GradeService) {
                            return GradeService.get({id: $stateParams.id}).then(
                                function (response) {
                                    return response.data;
                                },
                                function () {
                                }
                            );
                        },
                    },

                },
                'attendanceForm@gradeDetail': {
                    templateUrl: function ($stateParams) {
                        var entity = "grade";
                        return 'partial/attendance-form?forEntity=' + entity + '&forEntityId=' + $stateParams.id;
                    },
                },
            }
        })

        .state('gradeExamination', {
            url: '/grade/{id}/examination',
            views: {
                '': {templateUrl: 'partial/grade-examination'},
            },
            ncyBreadcrumb: {
                label: 'Examination',
                parent: 'gradeDetail'
            }
        })

        .state('gradeSchedule', {
            url: '/grade/{id}/schedule',
            views: {
                '': {templateUrl: 'partial/grade-schedule'},
            },
            ncyBreadcrumb: {
                label:'Schedule',
                parent: 'gradeDetail'
            }
        })

        .state('gradeDiscussion', {
            url: '/grade/{id}/discussion',
            controller: 'GradeDiscussionController',
            views: {
                '': {templateUrl: 'partial/grade-discussion'}
            },
            ncyBreadcrumb: {
                label:'Discussion',
                parent: 'gradeDetail'
            }

        })
        .state('gradeAttendanceReport', {
            url: '/grade/{id}/attendance/report',
            views: {
                '': {templateUrl: 'partial/grade-attendance-report'}
            },
            ncyBreadcrumb: {
                label:'Attendance Detail',
                parent: 'gradeDetail',
            },
        })

        .state('gradeListCard', {
            url: '/classes.html',
            ncyBreadcrumb: {
                label: 'Classes',
                parent: 'dashboard',
            },
            views: {
                '': {templateUrl: 'partial/grade-list-card'}
            },

        })

        .state('gradeAssign', {
            url: '/grade/assign',
            views: {
                '': {templateUrl: 'partial/grade-user-form'}
            }
        })

        .state('gradeEdit', {
            url: '/grade/edit/{id}',
            params: {
                stateTitle: 'Edit Grade',
                actionParams: {action:'edit'},
                },
            ncyBreadcrumb: {
                label:'Edit Grade',
                parent: 'gradeDetail',
            },
            views: {
                '': {
                    templateUrl: 'partial/grade-form',
                },
            }
        })

        .state('gradeAssigns', {
            url: '/grade/assigns',
            views: {
                '': {templateUrl: 'partial/grade-user-forms'}
            }
        })

        .state('gradeDelete', {
            url: '/grade/{id}/delete',
            params: {
                stateTitle: 'Delete Grade',
                actionParams: {action: 'delete'},
            },
            views: {
                '': {
                    templateUrl: 'partial/grade-delete',
                },
            }
        })

        // MARKS
        .state('marksCreate', {
            url: '/create',
            params: {
                stateTitle: 'Create Marks',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/marks-form'}
            }
        })

        .state('bulkMarksEntry',{
            url: '/bulk-marks-entry',
            views: {
                '': {
                    templateUrl: 'partials/add-bulk-marks',
                }
            },

            ncyBreadcrumb: {
                label:'Add Bulk Marks',
                parent:'examinationListCard'
            }

        })

        .state('marksEdit', {
            url: '/marks/{id}/edit',
            params: {
                stateTitle: 'Edit Marks',
                actionParams: {action: 'edit'},
            },
            views: {
                '': {
                    templateUrl: 'partial/marks-form',
                },
            }
        })

        .state('examinationMarksAdd', {
            url: '/examination/{id}/marks/add',
            params: {
                stateTitle: 'Add Examination Marks',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/add-student-marks'}
            },
            ncyBreadcrumb: {
                label:'Add Marks',
                parent:'examinationListCard'
            }
        })


        .state('markDetail', {
            url: '/mark/{id}/detail',
            params: {
                stateTitle: 'Mark Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {templateUrl: 'partial/mark-detail'}
            }
        })

        .state('marksListCard', {
            url: '/marks/all',
            views: {
                '': {templateUrl: 'partial/marks-list-card'}
            },
            ncyBreadcrumb: {
                label: 'All Marks',
            }

        })

        // ROLE
        .state('roleCreate', {
            url: '/role/create',
            params: {
                stateTitle: 'Create Role',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/role-form'}
            },
            ncyBreadcrumb: {
                label:'Create Role',
            }
        })

        .state('roleListCard', {
            url: '/roles.html',
            ncyBreadcrumb: {
                label: 'All Roles',
                parent: 'dashboard',
            },

            views: {
                '': {templateUrl: 'partial/role-list-card'}
            }
        })

        .state('roleDetail', {
            url: '/role/{id}/detail',
            ncyBreadcrumb: {
                label: '{{role.name}}',
                parent: 'roleListCard',
            },
            params: {
                stateTitle: 'Class Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {templateUrl: 'partial/role-detail'}
            }
        })
        .state('rolePermission', {
            url: '/role/{id}/permission',
            params: {
                stateTitle: 'Manage Permission',
                actionParams: {action: 'permission'},
            },
            views: {
                '': {templateUrl: 'partial/role-permission'}
            },
            ncyBreadcrumb: {
                label:'Role Permission',
                parent: 'roleDetail',
            },
        })

        .state('roleEdit', {
            url: '/role/edit/{id}',
            params: {
                stateTitle: 'Edit Role',
                actionParams: {action: 'edit'},
            },
            ncyBreadcrumb: {
                label:'Edit Role',
                parent: 'roleListCard',
            },
            views: {

                '': {
                    templateUrl: 'partial/role-form',
                },
            }
        })

        .state('assignRoleToUser', {
            url: '/assign/role/{id}/roles',
            params: {
                stateTitle: 'Assign Role to User',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/assign-role-to-user-form'}
            }
        })

        .state('roleDelete', {
            url: '/role/{id}/delete',
            params: {
                stateTitle: 'Delete Role',
                actionParams: {action: 'delete'},
            },
            views: {
                '': {
                    templateUrl: 'partial/role-delete',
                },
            }
        })



        // Event
        .state('eventCreate', {
            url: '/event/create',
            params: {
                stateTitle: 'Create Event',
                actionParams: {action:'create'},
            },
            views: {
                '': {templateUrl: 'partial/event-form'}
            }
        })
        // SCHEDULE
        .state('scheduleCreate', {
            url: '/schedule/create',
            params: {
                stateTitle: 'Create Schedule',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/schedule-form'}
            }
        })

        .state('scheduleListCard', {
            url: '/schedule/all',
            views: {
                '': {templateUrl: 'partial/schedule-list-card'}
            },
            ncyBreadcrumb: {
                label: 'All Schedules',
                parent: 'dashboard'
            }
        })

        .state('scheduleDetail', {
            url: '/schedule/{id}/detail',
            params: {
                stateTitle: 'Schedule Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {templateUrl: 'partial/schedule-detail'}
            },
            ncyBreadcrumb: {
                label: 'Schedule Detail',
                parent: 'scheduleListCard'
            }
        })

        .state('scheduleEdit', {
            url: '/schedule/edit/{id}',
            controller: 'ScheduleFormController',
            params: {
                stateTitle: 'Edit Schedule',
                actionParams: {action: 'edit'},
            },
            views: {
                '': {
                    templateUrl: 'partial/schedule-form',
                },
            },

        })

        .state('scheduleDelete', {
            url: '/schedule/{id}/delete',
            params: {
                stateTitle: 'Delete Schedule',
                actionParams: {action: 'delete'},
            },
            views: {
                '': {
                    templateUrl: 'partial/schedule-delete',
                },
            }
        })

        // USER
        .state('userCreate', {
            url: '/register',

            params: {
                stateTitle: 'Register',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/user-form'}
            },
            ncyBreadcrumb: {
                label: 'Register User',
            },

        })


        .state('userInfoCard', {
            url: '/user/{id}/profile',
            controller: 'UserProfileController',
            resolve: {
                UserJSON: function ($stateParams, UserService) {
                    return UserService.get({id: $stateParams.id}).then(
                        function (response) {
                            console.log(response.data);
                            return response.data;
                        },
                        function () {
                        }
                    );
                },
            },
            templateUrl: 'partial/user-detail-info-card',
        })


        .state('userProfile', {
            url: '/user/{id}/profile',
            controller: 'UserProfileController',
            resolve: {
                UserJSON: function ($stateParams, UserService) {
                    return UserService.get({id: $stateParams.id}).then(
                        function (response) {
                            console.log(response.data);
                            return response.data;
                        },
                        function () {
                        }
                    );
                },
            },
            ncyBreadcrumb: {
                label: '{{user.fullName}}',
                parent: 'userListCard',
            },
            params: {
                stateTitle: 'User Profile',
                actionParams: {action: 'viewDetail'},
            },
            // views: {
            // '': {
            templateUrl: 'partial/user-detail',
            // }
            // }
        })

        // .state('userExamination', {
        //     url: '/user/{id}/examination',
        //     views: {
        //         '': {templateUrl: 'partial/user-examination'},
        //     },
        //     ncyBreadcrumb: {
        //         label:'Examination',
        //         parent: 'userProfile',
        //     },
        // })

        // .state('userViewAttendance', {
        //     url: '/user/{id}/attendance',
        //     views: {
        //         '': {templateUrl: 'partial/user-view-attendance'},
        //     },
        //     ncyBreadcrumb: {
        //         label:'View Attendance',
        //         parent: 'userProfile',
        //     },
        // })
        //
        // .state('userDiscussion', {
        //     url: '/user/{id}/discussion',
        //     views: {
        //         '': {templateUrl: 'partial/user-discussion'},
        //     },
        //     ncyBreadcrumb: {
        //         label: 'Discussion',
        //         parent: 'userProfile',
        //     },
        // })


        .state('userListCard', {
            url: '/people.html',
            ncyBreadcrumb: {
                label: 'Users',
                parent: 'dashboard',
            },
            views: {
                '': {templateUrl: 'partial/user-list-card'}
            }
        })

        .state('userEdit', {
            url: '/user/{id}/edit',
            params: {
                stateTitle: 'Edit User Details',
                actionParams: {action: 'edit'},
            },
            ncyBreadcrumb: {
                label:'Edit User',
                parent: 'userProfile',
            },
            ncyBreadcrumb: {
                label:'Edit User',
                parent: 'userProfile',
            },
            views: {
                '': {
                    templateUrl: 'partial/user-form',
                },
                'assignGradeToUser@userEdit': {
                    templateUrl: 'partial/assign-grade-to-user-form'
                },
                'assignCourseToUser@userEdit': {
                    templateUrl: 'partial/assign-course-to-user-form',
                },

                'assignRoleToUser@userEdit': {
                    templateUrl: 'partial/assign-role-to-user-form',
                },
            }
        })


        .state('userDelete', {
            url: '/user/{id}/delete',
            params: {
                stateTitle: 'Delete User',
                actionParams: {action: 'delete'},
            },
            views: {
                '': {
                    templateUrl: 'partial/user-delete',
                },
            }
        })

        //Messages
        .state('messageCreate', {
            url: '/message/create',
            params: {
                stateTitle: 'Create Message',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/message-form'}
            },
            ncyBreadcrumb: {
                label: 'Create Message',
            },
        })
        .state('messageListCard', {
            url: '/message/all',
            views: {
                '': {templateUrl: 'partial/message-list-card'}
            },
            ncyBreadcrumb: {
                label: 'Mailbox',
                parent: 'dashboard'
            },
        })
        .state('messageDetail', {
            url: '/message/{id}/detail',
            params: {
                stateTitle: 'Message Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {templateUrl: 'partial/message-detail'}
            }
        })

        // Transactions
        .state('transactionCreate', {
            url: '/transaction/create',
            params: {
                stateTitle: 'Transaction',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/transaction-form'}
            }
        })

        .state('transactionListCard', {
            url: '/transaction/all',
            views: {
                '': {
                    templateUrl: 'partial/transaction-list-card',
                },
            }
        })

        .state('transactionEdit', {
            url: '/transaction/edit/{id}',
            params: {
                stateTitle: 'Edit Transaction',
                actionParams: {action: 'edit'},
            },
            views: {
                '': {
                    templateUrl: 'partial/transaction-form',
                },
            }
        })

        .state('transactionDetail', {
            url: '/transaction/{id}/detail',
            params: {
                stateTitle: 'Transaction Detail',
                actionParams: {action: 'view-detail'},
            },
            views: {
                '': {templateUrl: 'partial/transaction-detail'}
            }
        })

        .state('transactionDelete', {
            url: '/transaction/{id}/delete',
            params: {
                stateTitle: 'Delete Transaction',
                actionParams: {action: 'delete'},
            },
            views: {
                '': {
                    templateUrl: 'partial/transaction-delete',
                },
            }
        })

        .state('examReportOptions', {
            url: '/examReportOptions',
            params: {
                stateTitle: 'Exam Report Options',
            },
            views: {
                '': {
                    templateUrl: 'partial/exam-report-options',
                },

            },
            ncyBreadcrumb: {
                label: 'Exam Report',

            }
        })

        .state('examinationTypes', {
            url: '/examinationTypes',
            params: {
                stateTitle: 'Examination Types',
            },
            views: {
                '': {
                    templateUrl: 'partial/examination-types',
                },

            },
            ncyBreadcrumb: {
                label: 'Examination Types',

            }
        })

        // change password
        .state('passwordChange', {
            url: '/password/change',
            params: {
                stateTitle: 'Change Password',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/change-password'}
            },
            ncyBreadcrumb: {
                label: 'Change Password'

            },
        })

        //organizational detail
        .state('organizationDetail', {
            url: '/partial/organization-detail',
            ncyBreadcrumb: {
                label: 'Organization Detail',
                parent: 'dashboard',
            },
            views: {
                '': {templateUrl: 'partial/organization-detail'}
            }
        })

        .state('noticeCreate', {
            url: '/notice/create',
            params: {
                stateTitle: 'Create Notice',
                actionParams: {action: 'create'},
            },
            views: {
                '': {templateUrl: 'partial/notice-form'}
            },
            ncyBreadcrumb: {
                label: 'Create Notice'

            },

        })

        .state('noticeEdit', {
            url: '/notice/edit/{id}',
            params: {
                stateTitle: 'Edit Notice',
                actionParams: {action: 'edit'},
            },
            ncyBreadcrumb: {
                label:'Edit Notice',
                parent: 'dashboard',
            },

            views: {
                '': {
                    templateUrl: 'partial/notice-form',
                },
            }
        });


    $urlRouterProvider.otherwise('/dashboard.html');

});

app.controller('AddressFormController', function ($scope,$stateParams,AddressService) {
    $scope.address = {};
    $scope.stateParams = $stateParams;

    $scope.getAddressModel = function(){
        var address = {
            address:$scope.address.address,
            zone:$scope.address.zone,
            district:$scope.address.district,


        }

        if($scope.address.id){
            address['id'] = $scope.address.id;
        }
        return address;
    }
    $scope.createAddress = function () {
        AddressService.post($scope.getAddressModel()).then(function (response) {
            alert('Address successfully added in the system.'+'\n'+'Check console.log for response.');
        });
    }

    // EDIT Section //
    $scope.loadAddressForEdit = function () {
        AddressService.get({id:$scope.stateParams.id}).then(function(response){
            $scope.address = response.data;
        });
    }

    $scope.editState = false;
    if($scope.stateParams.actionParams.action === 'edit'){
        $scope.editState = true;
        $scope.loadAddressForEdit();
    }

    $scope.edit = function(){
        AddressService.update($scope.getAddressModel()).then(function (response) {
            alert('Address Updated.');
        });
    }
});

app.controller('AddressListCardsController', function ($scope, AddressService) {

    $scope.addresses;


    $scope.gridOptions = { data: 'addresses',
        columnDefs:

            [ {field: 'id', displayName: 'ID', width: 50 },
               {field: 'address', displayName: 'Address'},
                {field: 'zone', displayName: 'Zone'},
                {field: 'district', displayName: 'District'},

            ],
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
    };

    $scope.loadAll = function(){
        AddressService.all().then(function(response) {
            $scope.addresses = response.data;
        });
    }

    $scope.deleteAddress = function (id) {
        AddressService.delete(id).then(function(response) {
            $scope.loadAll();
        });
    }


    $scope.loadAll();

});

app.controller('AddressProfileController', function ($scope, $stateParams, AddressService) {
    $scope.stateParams = $stateParams;
    $scope.address = {};

    $scope.loadAddresses = function () {
        AddressService.get({id:$scope.stateParams.id}).then(function(response) {
            $scope.address = response.data;
        });
    }
    $scope.loadAddresses();
});
(function () {
    app.directive('addressDetailInfoCard', function() {

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                address: '=address'
            },

            templateUrl:  'partial/address-detail-info-card',

            link: function(scope, elem, attrs) {
            },

            controller : ['$scope', function ($scope) {
            }],

        };
    });

})();
app.factory('AddressRESTClient', function ($resource) {
    return $resource('api/address/:id', {id: '@id',address: '@address'}, {
        'query': {method: 'GET', isArray: false },
        'update' : {method: 'PUT', params:{address : '@address'}, isArray: false},
        'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
    });
});
var AddressService = app.service('AddressService', function (AddressRESTClient) {
    return {
        get: function(id) {
            return AddressRESTClient.get({id:id.id}).$promise;
        },

        post: function(address){
            return AddressRESTClient.save(address).$promise;
        },

        delete: function(id){
            return AddressRESTClient.delete({id:id}).$promise;
        },

        all: function(){
            return AddressRESTClient.query().$promise;
        },

        update: function(address){
            return AddressRESTClient.update(address).$promise;
        }
    }
});
app.controller('AttendanceFormController', function ($stateParams, $scope, UserService, AttendanceService, CourseService, $mdDialog, GradeService) {
    $scope.attendance = {};
    $scope.attendance.attendanceRecords = {};


        $scope.coursePresent = function(userId){
        var data = {
            userId: userId,
            courseId: $scope.course.id,
            gradeId:$scope.course.grade.id,
            createdAt1: $scope.selectedDate
        }
            AttendanceService.coursePresent(data).then(function(response){
            // $scope.attendance = response.data;att
            });
    }

    $scope.courseAbsent= function(userId) {
        var data = {
            userId: userId,
            courseId: $scope.course.id,
            gradeId:$scope.course.grade.id,
            createdAt1: $scope.selectedDate

        }

        AttendanceService.courseAbsent(data).then(function(response){

            });
    }

    $scope.gradePresent = function(userId, gradeId){
        var data = {
            userId: userId,
            gradeId:gradeId,
            createdAt1: $scope.selectedDate
        }

        AttendanceService.gradePresent(data).then(function(response){

        });
    }

    $scope.gradeAbsent= function(userId, gradeId) {
        var data = {
            userId: userId,
            gradeId:gradeId,
            createdAt1: $scope.selectedDate
        }
        AttendanceService.gradeAbsent(data).then(function(response){

        });
    }

    $scope.examinationPresent = function(userId, gradeId){
        var data = {
            userId: userId,
            gradeId: gradeId,
            examinationId: $scope.examination.id
        }
        AttendanceService.examinationPresent(data).then(function(response){


        });
    }

    $scope.examinationAbsent= function(userId, gradeId) {
        var data = {
            userId: userId,
            gradeId: gradeId,
            examinationId: $scope.examination.id
        }
        AttendanceService.examinationAbsent(data).then(function(response){

        });
    }

    $scope.triggerAttendance = function(){

        var data = {
            gradeId: $scope.grade.id,
            createdAt1 : $scope.selectedDate
        }
        AttendanceService.query(data).then(function(response) {
            $scope.gradeAttendanceRecords = response.data;
        });
    }

    $scope.getUserAttendance = function() {

        var data = {
            'gradeId' : $scope.gradeId
        }

        GradeService.get({id:$scope.gradeId}).then(function (response) {
            $scope.users = response.data.users;
        });
    }
    $scope.loadGrades = function() {
        GradeService.all().then(function (response) {
            $scope.grades = response.data.grades;
        });
    }

    $scope.triggerAttendanceDate = function(){

        var data = {
            gradeId: $scope.gradeId,
            createdAt1 : $scope.selectedDate
        }
        AttendanceService.query(data).then(function(response) {
            $scope.gradeAttendanceRecord = response.data;
        });
    }


    $scope.addRemarksForDate = function ($event) {
        var confirm = $mdDialog.prompt()
            .title('Add remark for this date')
            .placeholder('Add remarks for the selected date.')
            .ok('Confirm')
            .cancel('Cancel');
        $mdDialog.show(confirm);
           };
    $scope.loadGrades();

});

(function () {
app.controller('AttendanceListCardsController', ['$scope','$controller', 'AttendanceService','GradeService','UserService', function ($scope, $controller, AttendanceService, GradeService, UserService) {
    $scope.attendance = {};
    $scope.months = [];

    $scope.getGradeAttendance = function() {
        if(!isNaN($scope.gradeId) && !isNaN($scope.monthNp)) {
             var data = {
                 'gradeId' : $scope.gradeId,
                 'monthNP' : $scope.monthNp
             }

            GradeService.all(data).then(function (response) {
                 $scope.users = response.data.grades.users;
                $scope.noOfDays = response.data.grades.noOfDays;

            });
        }

    }

    $scope.loadGrades = function() {
        GradeService.all().then(function (response) {
            $scope.grades = response.data.grades;
        });
    }

    $scope.loadMonths = function () {
        var months = [
            {id: 1, name: 'Jan'},
            {id: 2, name: 'Feb'},
            {id: 3, name: 'Mar'},
            {id: 4, name: 'Apr'},
            {id: 5, name: 'May'},
            {id: 6, name: 'Jun'},
            {id: 7, name: 'July'},
            {id: 8, name: 'Aug'},
            {id: 9, name: 'Sept'},
            {id: 10, name: 'Oct'},
            {id: 11, name: 'Nov'},
            {id: 12, name: 'Dec'},
        ];
        $scope.months = months;
    }

    $scope.loadGrades();
    $scope.loadMonths();
}]);
})();


/**
 * Created by SUDIP CHAND on 2016-08-30.
 */
app.factory('AttendanceRESTClient', function ($resource) {
    return $resource('api/attendance/:id', {id: '@id'}, {
        'query': {method: 'GET', isArray: false }
    });
});
/**
 * Created by SUDIP CHAND on 2016-08-30.
 */

var AttendanceService = app.service('AttendanceService', function (AttendanceRESTClient) {

    var customParameters = {'ASSIGN_PRESENT_TO_USERS' : {'action' : 'assignPresentToUsers'}, // multiple users command
        'ASSIGN_ABSENT_TO_USERS' : {'action' : 'assignAbsentToUsers'},
    };

    return {

        //
        get: function(id) {
            return AttendanceRESTClient.get({id:id.id}).$promise;
        },

        query: function($data) {
            return AttendanceRESTClient.query($data).$promise;
        },

        post: function(attendance){
            return AttendanceRESTClient.save(attendance).$promise;
        },

        all: function(){
            return AttendanceRESTClient.query().$promise;
        },

        edit: function(attendance){
            return AttendanceRESTClient.edit(attendance)
        },

        //
        gradePresent: function(attendance){
            attendance.examinationId = null;
            attendance.courseId = null;
            return this.present(attendance);
        },

        coursePresent: function(attendance){
            attendance.examinationId = null;
            return this.present(attendance);
        },

        examinationPresent: function(attendance){
            attendance.courseId = null;
            // attendance.gradeId = null;
            return this.present(attendance);
        },

        //
        gradeAbsent: function(attendance){
            attendance.examinationId = null;
            attendance.courseId = null;
            return this.absent(attendance);
        },

        courseAbsent: function(attendance){
            attendance.examinationId = null;
            return this.absent(attendance);
        },

        examinationAbsent: function(attendance){
            attendance.courseId = null;
            // attendance.gradeId = null;
            return this.absent(attendance);
        },

        //
        present: function(attendance){
            attendance.in_or_out = 1;
            return this.post(attendance);
        },

        absent: function(attendance){
            attendance.in_or_out = 0;
            return this.post(attendance);
        }
    }
});
/**
 * Created by sadhikari on 8/28/2016.
 */

app.controller('LoginController', function ($scope, $http) {
    var loginURL = 'login';

    var logoutURL = 'logout';

    $scope.logout = function(){
        $http.post(logoutURL, {}, {})
            .success(function (data, status, headers, config) {
                window.location.href = loginURL;
            })
            .error(function (data, status, header, config) {

            });
    }
});

(function () {

    app.controller('CourseFormController', function ($scope, $state,ToastService, $mdDialog, $stateParams,CourseService, RoomService, GradeService, $element, $location) {


        var stateParams = $stateParams;
        $scope.stateParams = $stateParams;
        $scope.course = {};
        $scope.course.name;
        $scope.course.roomId;
        $scope.course.gradeId;
        $scope.course.practical;
        $scope.course.fullMarks;
        $scope.course.passMarks;
        $scope.course.theory;
        $scope.course.syllabus;
        $scope.course.details;

        $scope.loadAllGrades = function () {
            GradeService.all().then(function (response) {
                $scope.grades = response.data.grades;

            });
        }

        $scope.loadAllRooms = function () {
            RoomService.all().then(function (response) {
                $scope.rooms = response.data;

            });
        }
        $scope.loadCourse = function () {
            $scope.course = CourseService.get({id: $scope.params.id});
        }

        $scope.createCourse = function () {
            CourseService.post($scope.getCourseModel()).then(function(response){
                if(response.status == 200){
                    ToastService.showSuccessToast('Course');
                    $mdDialog.hide();
                    location.reload();
                }
                else {
                    ToastService.showErrorToast('Course');
                }

            });
        }


        $scope.cancelCourse = function () {
            $mdDialog.hide();
        }

        $scope.getCourseModel = function(){
            var course = {
                roomId: $scope.course.roomId,
                gradeId: $scope.course.gradeId,
                name: $scope.course.name,
                practical: $scope.course.option,
                fullMarks: $scope.course.fullMarks,
                passMarks: $scope.course.passMarks,
                theory: $scope.course.option,
                syllabus: $scope.course.syllabus,
                details: $scope.course.details,
                theoryFullMarks: $scope.course.theoryFullMarks,
                theoryPassMarks: $scope.course.theoryPassMarks,
                practicalFullMarks: $scope.course.practicalFullMarks,
                practicalPassMarks: $scope.course.practicalPassMarks,
                parentCourseId: $scope.course.parentCourseId,

            }

            if ($scope.course.id) {
                course['id'] = $scope.course.id;
            }
            return course;
        }

        $scope.loadCourseForEdit = function () {
            console.log('courseId'+$scope.courseId);
            CourseService.get({id: $scope.courseId}).then(function (response) {
                $scope.course = response.data;
                console.log($scope.course);

            });
        }

        if ($scope.editState == true) {
            $scope.loadCourseForEdit();
        }

        // $scope.editState = false;
        // if ($scope.stateParams.actionParams.action === 'edit') {
        //     $scope.editState = true;
        //     $scope.loadCourseForEdit();
        // }

        $scope.edit = function () {
            CourseService.update($scope.getCourseModel()).then(function (response) {
                if(response.status == 200){
                    ToastService.showUpdateToast('Course');
                    $mdDialog.hide();
                    location.reload();
                    // $state.go('courseDetail',{id:stateParams.id});
                }
                else {
                    ToastService.showErrorUpdateToast('Course');
                }
            });
        }

        $scope.cancel = function () {
            $mdDialog.hide();
        }


        //INITIALIZATION//
        $scope.init = function () {
            $scope.loadAllGrades();
            $scope.loadAllRooms();
        }
        $scope.init();
    });

})();


app.controller('CourseListCardsController', function ($scope, $interval, CourseService, ProductMsgService, ToastService, $mdDialog, $stateParams, FilterService) {

    $scope.courses;

    $scope.gridOptions = {
        data: 'courses',
        columnDefs: [{field: 'id', displayName: 'ID', width: 50},
            {field: 'name', displayName: 'Name'},
            {field: 'roomId', displayName: 'Room id'},
            {field: 'gradeId', displayName: 'Grade id'},
        ],
        enableRowSelection: true,
        enableSelectAll: true,
        enableSorting: false,
        selectionRowHeaderWidth: 35,
        enableHorizontalScrollbar: 1,
        enableColumnResizing: true,

    };


    $scope.courseListCard = {};
    $scope.courseListCard.UI = {flag:{},click:{}};
    $scope.courseListCard.UI.click.sendNotificationDialog = function (ev, options) {
        // Demo :: https://material.angularjs.org/latest/demo/dialog
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
            .title("Send Message / Notice")
            .textContent("Send message to the course")
            .placeholder('type message here...')
            .ariaLabel('Message')
            // .initialValue('Buddy')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(
            function (result) {
                var msg = {};
                // msg.recipients = rec;
                msg.message = result;
                msg.courseId = options.courseId
                msg.subject = msg.message.slice(0, 20) + (msg.message.length > 20 ? '...' : ''); // Add .. only if message is greater than 20
                ProductMsgService.post(msg).then(function (response) {
                    if(response.status == 200){
                        ToastService.showSuccessMessageToast('Message');
                    }
                    else {
                        ToastService.showErrorMessageToast('Message');
                    }
                });
            },
            function () {
                // Cancel
            }
        );
    }

    $scope.stateParams = $stateParams;

    $scope.courseListCardDelete = function (param, event) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete this subject?')
            .textContent('Record will be deleted permanently.')
            .targetEvent(event)
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            CourseService.delete(param.id).then(function (response) {
                if(response.status == 200){
                    ToastService.showDeleteToast('Subject');
                    location.reload();
                }
                else {
                    ToastService.showErrorDeleteToast('Subject');
                }

            })

        });
    };


    $scope.loadAll = function () {
        CourseService.all().then(function (response) {
            $scope.courses = response.data.courses;
            console.log($scope.courses);
        });
    }

    $scope.deleteCourse = function (id) {
        alert('Do you want to delete the course?');
        CourseService.delete(id).then(function (response) {
            $scope.loadAll();
        });
    }

    //course pop-up edit form
    $scope.courseEdit = function (courseId, ev) {
        $mdDialog.show({
            targetEvent: ev,
            templateUrl: 'partial/course-form',
            clickOutsideToClose: true,
            locals: {
                courseId: courseId,
                editState: true
            },
            controller: ['$scope', 'courseId', 'editState', function($scope, courseId, editState) {
                // share data to control being used by partial/course-form
                $scope.courseId = courseId;
                $scope.editState = editState
            }]
        });
    }

    // for course pop form
    $scope.loadCourseForm = function (ev) {
        $mdDialog.show({
            templateUrl: 'partial/course-form',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.loadAll();
});

app.controller('CourseUserFormController', function ($scope, $stateParams, CourseService, UserService, $state) {
    $scope.courses = {};
    $scope.user;
    $scope.courseUser = {};
    $scope.stateParams = $stateParams;

    $scope.loadUser = function (id) {
        UserService.get(id).then(function (response) {
            $scope.user = response.data;
        });
    };

    $scope.loadAllCourse = function () {
        CourseService.all().then(function (response) {
            $scope.courses = response.data
        });
    }

    $scope.getCourseUserModel = function () {
        var courseUser = {
            userId: $scope.user.id,
            courseId: $scope.courseUser.courseId,
        }
        return courseUser;
    }

    $scope.assignCourseToUser = function () {
        console.log($scope.getCourseUserModel());
        CourseService.assignCourseToUser($scope.getCourseUserModel()).then(function (response) {
            alert('Successfully added in the system.' + '\n' + 'Check console.log for response.');
        });
    }

    $scope.loadAllCourse();
    $scope.loadUser({id: $scope.stateParams.id});

});

app.controller('RemoveCourseUserController', function ($scope, $stateParams, CourseService, UserService, $state) {
    $scope.courses = {};
    $scope.user;
    $scope.courseUser = {};
    $scope.stateParams = $stateParams;

    $scope.loadUser = function (id) {
        UserService.get(id).then(function (response) {
            $scope.user = response.data;
        });
    };

    $scope.loadAllCourse = function () {
        CourseService.all().then(function (response) {
            $scope.courses = response.data
        });
    }

    $scope.getCourseUserModel = function () {
        var courseUser = {
            userId: $scope.user.id,
            courseId: $scope.courseUser.courseId,
        }
        return courseUser;
    }

    $scope.removeCourseFromUser = function () {
        console.log($scope.removeCourseFromUser());
        CourseService.removeCourseFromUser($scope.removeCourseFromUser()).then(function (response) {
            alert('Successfully removed from the system.' + '\n' + 'Check console.log for response.');
        });
    }

    $scope.loadAllCourse();
    $scope.loadUser({id: $scope.user.id});

});


(function () {
    app.controller('CourseDetailController', ['$scope',
        '$state',
        '$stateParams',
        'CourseService',
        'ExaminationService',
        'ScheduleService',
        '$mdDialog',
        'ProductMsgService',
        'ToastService',
        function CourseDetailController($scope,
                                        $state,
                                        $stateParams,
                                        CourseService,
                                        ExaminationService,
                                        ScheduleService,
                                        $mdDialog,
                                        ProductMsgService,
                                        ToastService ) {

            $scope.stateParams = $stateParams;
            $scope.course = {};
            $scope.course.users = [];
            $scope.courseDetail = {};

            // UI
            $scope.courseDetail.UI = {flag: {}, click: {}};

            $scope.courseDetail.UI.click.showCreateExaminationDialog = function (ev, options) {
                // Demo :: https://material.angularjs.org/latest/demo/dialog
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.prompt()
                    .title('Create ' + options['type'] + ".")
                    .textContent("You can edit the details later. Date is optional.")
                    .placeholder('Date (2074-02-02)')
                    .ariaLabel('Date')
                    // .initialValue('Buddy')
                    .targetEvent(ev)
                    .ok('Ok')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(
                    function (result) {
                        var examinationModel = {
                            type: options['type'],
                            fullMarks: $scope.course.fullMarks,
                            passMarks: $scope.course.passMarks,
                            syllabus: $scope.course.syllabus,
                            details: $scope.course.details,
                            gradeId: $scope.course.gradeId,
                            courseId: $scope.course.id,
                        }

                        ExaminationService.post(examinationModel).then(function (response) {
                            $state.go('examinationDetail', {id: response.data.id});
                        }, function (rejection) {

                        })
                    },

                    function () {
                        // Cancel
                    });
            }

            $scope.courseDetail.UI.click.showScheduleFormDialog = function (ev, options) {
                $mdDialog.show({
                    templateUrl: 'partial/schedule-form?scheduleType=routine&forEntity=course&forEntityId=' + $scope.course.id,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    .then(function (answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

            $scope.courseDetail.UI.click.showFileUpload = function (ev, options) {
                $mdDialog.show({
                    controller: function ($scope) {

                    },
                    templateUrl: 'partial/file-upload?forEntity=course&forEntityId=' + $scope.course.id,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    .then(function (answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

            $scope.courseDetail.UI.click.sendNotificationDialog = function (ev, options) {
                // Demo :: https://material.angularjs.org/latest/demo/dialog
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.prompt()
                    .title("Send Message / Notice")
                    .textContent("Send message to the course")
                    .placeholder('type message here...')
                    .ariaLabel('Message')
                    // .initialValue('Buddy')
                    .targetEvent(ev)
                    .ok('Ok')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(
                    function (result) {
                        var msg = {};
                        // msg.recipients = rec;
                        msg.message = result;
                        msg.courseId = $scope.course.id;
                        msg.subject = msg.message.slice(0, 20) + (msg.message.length > 20 ? '...' : ''); // Add .. only if message is greater than 20
                        ProductMsgService.post(msg).then(function (response) {
                            if(response.status == 200){
                                ToastService.showSuccessMessageToast('Message');
                            }
                            else {
                                ToastService.showErrorMessageToast('Message');
                            }
                        });
                    },
                    function () {
                        // Cancel
                    }
                );
            }

            this.loadCourse = function () {
                CourseService.get({id: $scope.stateParams.id})
                    .then(function (response) {
                        $scope.course = response.data;
                        console.log($scope.course);
                    });
            }

            this.loadCourse();
        }]);

    app.controller('CourseDeleteController', function ($scope, $stateParams, $state, $location, CourseService, ToastService) {
        var stateParams = $stateParams;
        $scope.loadCourse = function () {
            CourseService.get({id: stateParams.id}).then(function (response) {
                $scope.course = response.data;
            });
        }

        $scope.deleteCourse = function (param) {
            if (confirm('Are you sure ?')) {
                CourseService.delete(param.id).then(function (response) {
                    if(response.status == 200){
                        ToastService.showDeleteToast('Course');
                        $location.path('/subjects.html');
                    }
                    else {
                        ToastService.showErrorDeleteToast('Course');

                    }
                });
            }
        }

        $scope.cancel = function(){
            $state.go('courseDetail',{id:stateParams.id});
        }

        $scope.loadCourse();
    });

    app.controller('CourseDiscussionController', function ($scope, $stateParams, ProductMsgService, CourseService) {

        $scope.threads = [];

               $scope.loadAll = function () {
            var options = {courseId: $stateParams.id};

            ProductMsgService.query(options).then(function (response) {
                $scope.threads = response.data;
            });

            CourseService.get({id: $stateParams.id})
                .then(function (response) {
                    $scope.course = response.data;

                });

        }


        $scope.loadAll();

    });

    app.controller('CourseExaminationController',function ($scope, $stateParams, $mdDialog, ExaminationService, CourseService, MarksService, ToastService) {
        $scope.examinations = [];
        $scope.course = {};
        $scope.courseExamination = [];

        $scope.courseExamination.UI = {flag:{},click:{}};


        $scope.courseExamination.UI.click.showCreateExaminationDialog = function(ev,options) {
            console.log(options);
            $mdDialog.show({
                controller: function($scope){

                },
                templateUrl: 'partial/course-examination-form?forEntityId='+$scope.course.id+'&examinationType='+options['type'],
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $scope.courseExaminationDelete = function (param, event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this examination?')
                .textContent('Record will be deleted permanently')
                .targetEvent(event)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                ExaminationService.delete(param.id).then(function (response) {
                    if(response.status == 200){
                        ToastService.showDeleteToast('Examination');
                        $scope.examinations.splice(param.index, 1);
                        // location.reload();
                    }
                    else {
                        ToastService.showErrorDeleteToast('Examination');
                    }

                })

            });
        }


        $scope.findMarksEntriesForUser = function() {
            var options = {request: 'REQUEST-MARKS-FOR-USER' };
            MarksService.query(options).then(function (response) {
               $scope.marksForUser =  response.data;
               console.log($scope.marksForUser);
            });
        }

        $scope.loadAll = function(){
            var options = {courseId: $stateParams.id  };
            ExaminationService.query(options).then(function (response) {
                $scope.examinations = response.data;
                console.log('examinations'+response);
            });

            CourseService.get({id: $stateParams.id})
                .then(function (response) {
                    $scope.course = response.data;

                });

        }

        $scope.createExamination = function () {
            var courseExaminationModel = {
                courseId: $scope.course.id,
                gradeId:$scope.course.gradeId,
                name:$scope.course.name,
                type:$scope.courseExamination.type,
                fullMarks:$scope.courseExamination.fullMarks,
                passMarks:$scope.courseExamination.passMarks,
                syllabus:$scope.courseExamination.syllabus,
                details:$scope.courseExamination.details,
            }
            ExaminationService.post(courseExaminationModel).then(function(response){
                alert('Examination successfully added in the system.'+'\n'+'Check console.log for response.');
            });
        }

        $scope.cancel = function () {

        }

        $scope.loadAll();
        // $scope.findMarksEntriesForUser();

    });

    app.controller('CourseAttendanceController', function ($scope, $stateParams, CourseService) {
        $scope.data = {
            model: null,
            availableOptions: [
                {
                    "id": 01,
                    "month": "Baishak"
                },
                {
                    "id": 02,
                    "month": "Jestha"
                },
                {
                    "id": 03,
                    "month": "Asar"
                },
                {
                    "id": 04,
                    "month": "Shrawan"
                },
                {
                    "id": 05,
                    "month": "Bhadra"
                },
                {
                    "id": 06,
                    "month": "Ashwin"
                },
                {
                    "id": 07,
                    "month": "Kartik"
                },
                {
                    "id": 08,
                    "month": "Mangsir"
                },
                {
                    "id": 09,
                    "month": "Poush"
                },
                {
                    "id": 10,
                    "month": "Magh"
                },
                {
                    "id": 11,
                    "month": "Falgun"
                },
                {
                    "id": 12,
                    "month": "Chaitra"
                }
            ]
        };
    
    
    
        $scope.stateParams = $stateParams;
        $scope.course = {};
        $scope.loadCourse = function () {
            CourseService.get({id: $scope.stateParams.id}).then(function (response) {
                $scope.course = response.data;
                $scope.course.users = response.data.users;

            });
        }
        $scope.loadCourse();
    });

    app.controller('CourseScheduleController', function ($scope, $stateParams, CourseService) {


        $scope.stateParams = $stateParams;
        $scope.course = {};
        $scope.loadCourse = function () {
            CourseService.get({id: $scope.stateParams.id}).then(function (response) {
                $scope.course = response.data;
                $scope.course.schedule = response.data.schedule;
            });
        }
        $scope.loadCourse();
    });


})();
(function () {
    app.directive('courseDetailInfoCard', function() {

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                course: '=course'
            },

            templateUrl:  'partial/course-detail-info-card',

            link: function(scope, elem, attrs) {

            },

            controller : ['$scope', 'PrintService', function ($scope, PrintService) {
                $scope.printCard = function(param) {
                    PrintService.printCourse({id: param['id']});
                }
            }],

        };
    });

})();
app.factory('CourseRESTClient', function ($resource) {
    return $resource('api/course/:id', {id: '@id'}, {'query': {method: 'GET', isArray: false },
    			        'update' : {method: 'PUT', params:{grade : '@grade'}, isArray: false}
});
});
var CourseService = app.service('CourseService', function (CourseRESTClient) {

    var customParameters = {'ASSIGN_COURSE_TO_USER' : {'action' : 'assignCourseToUser'},
        'REMOVE_ALL_COURSES_ASSIGNED_TO_USER' : {'action' : 'removeAllCourseUserData'},
        'REMOVE_COURSE_ASSIGNED_TO_USER' : {'action' : 'removeCourseFromUser'},
    };

    return {
        get: function(id) {
             return CourseRESTClient.get({id:id.id}).$promise;
        },

        getEdit:function(id){
            return CourseRESTClient.getEdit({id:id.id});
        },

        post: function(course){
            return CourseRESTClient.save(course).$promise;
        },

        assignCourseToUser: function(courseUser){

            courseUser.customParameters = customParameters['ASSIGN_COURSE_TO_USER'];
            return CourseRESTClient.save(courseUser).$promise;
        },

        removeCourseFromUser: function(courseUser){

            courseUser.customParameters = customParameters['REMOVE_COURSE_ASSIGNED_TO_USER'];
            return CourseRESTClient.update(courseUser).$promise;
        },

        delete: function(id){
            return CourseRESTClient.delete({id:id}).$promise;
        },

        all: function(options){
            return CourseRESTClient.query(options).$promise;
        },

        update: function(course){
            return CourseRESTClient.update(course).$promise;
        }
    }
});
app.controller('ExaminationFormController', function ($scope, $stateParams, GradeService, RoomService, CourseService, ExaminationService,$mdDialog, ToastService, $location, $state) {
    $scope.examination = {};
    $scope.courses = {};
    $scope.grades = {};
    // $scope.examination.name;
    // $scope.showFormProgressSpinner = false;
    $scope.stateParams = $stateParams;
    $scope.showGradeExaminationTypes = false;
    $scope.showCourseExaminationTypes = false;
    $scope.showFullMarksField = false;
    $scope.showPassMarksField = false;
    $scope.selectedGrade = undefined;
    $scope.coursesListed = false;
    var stateParams = $stateParams;
    $scope.selectAllClicked = false;
    $scope.displaySelectData = "Select All";

    $scope.getExaminationModel = function () {
        var examination = {
            name: $scope.examination.name,
            uniqueName: $scope.examination.uniqueName,
            syllabus: $scope.examination.syllabus,
            details: $scope.examination.details,
            typeId: $scope.examination.typeId,
            fullMarks: $scope.examination.fullMarks,
            passMarks: $scope.examination.passMarks,
            parentExamId: $scope.examination.parentExamId,
            gradeId: $scope.examination.gradeId,
            courseId: $scope.examination.courseId,
            roomId: $scope.examination.roomId,
            remarks: $scope.examination.remarks,
            question: $scope.examination.question,


        }

        if ($scope.examination.id) {
            examination['id'] = $scope.examination.id;
        }

        return examination;
    }

    $scope.loadAllGrades = function () {
        GradeService.all({GRADE_EXAM_TYPES: 1}).then(function (response) {
            $scope.grades = response.data.grades;
            $scope.gradeExaminationTypes = response.data.examinationTypes;

        });
    }

    $scope.loadAllRooms = function () {
        RoomService.all().then(function (response) {
            $scope.rooms = response.data;

        });
    }

    $scope.loadAllCourses = function () {
        CourseService.all({COURSE_EXAM_TYPES: 1}).then(function (response) {
            $scope.courses = response.data.courses;
            $scope.courseExamTypes = response.data.examinationTypes;
        });
    }

    $scope.loadExamination = function () {
        $scope.examination = ExaminationService.get({id: $scope.params.id});
    }

    $scope.createExamination = function () {
        ExaminationService.post($scope.getExaminationModel()).then(function (response) {
            if (response.status == 200) {
                ToastService.showSuccessToast('Examination');
                $mdDialog.hide();
                location.reload();
            }
            else {
                ToastService.showErrorToast('Examination');
            }
        });
    }
    $scope.cancelExamination = function(){
            $mdDialog.hide();
    }

    // EDIT Section //
    $scope.loadExaminationForEdit = function () {
        ExaminationService.get({id: $scope.stateParams.id}).then(function (response) {
            $scope.examination = response.data;
        });
    }

    // $scope.editState = false;
    // if ($scope.stateParams.actionParams.action === 'edit') {
    //     $scope.editState = true;
    //     $scope.loadExaminationForEdit();
    // }

    $scope.edit = function () {
        ExaminationService.update($scope.getExaminationModel()).then(function (response) {
            if (response.status == 200) {
                ToastService.showUpdateToast('Examination');
                $state.go('examinationDetail', {id: stateParams.id});
            }
            else {
                ToastService.showErrorUpdateToast('Examination');
            }
        });
    }

    $scope.selectAll = function () {

        var selectedGradeIds = [];

        if(!$scope.selectAllClicked){
            $scope.showGradeExaminationTypes = true;
            //if clicked first time
            $scope.selectAllClicked = true;
            $scope.displaySelectData = "Unselect All";
            $scope.grades.forEach(function (grade) {
                // console.log('gid'+grade.id)
                selectedGradeIds.push(grade.id);
            })
        } else {
            $scope.showGradeExaminationTypes = false;
            $scope.selectAllClicked = false;
            $scope.displaySelectData = "Select All";

            selectedGradeIds = [];//make empty after hitting unselect.
        }

        $scope.examination.gradeId = selectedGradeIds;
    }

    $scope.cancel = function(){
        $state.go('examinationDetail',{id:stateParams.id});
    };



    $scope.gradeChanged = function (selectedGrade) {
        $scope.showGradeExaminationTypes = true;
        $scope.showCourseExaminationTypes = false;
        $scope.showFullMarksField = false;
        $scope.showPassMarksField = false;
        $scope.examination.courseId = undefined;//remove previously set values
        $scope.examination.fullMarks = undefined;
        $scope.examination.passMarks = undefined;


        if (selectedGrade) {
            $scope.selectedGrade = selectedGrade;
            //if already loaded lists then
            // refresh them as grade changes
            if ($scope.coursesListed) {
                // reset course list
                $scope.courses = null;
                $scope.coursesListed = false;

            }
        }
    }


    $scope.triggerCourses = function () {
            if($scope.selectedGrade && !$scope.coursesListed) {
                //if grade is selected and course-list not loaded
                $scope.loadCourses($scope.selectedGrade);//load course for particular gradeId
                $scope.courseListed = true;
            }

    }


    $scope.loadCourses = function (gradeId) {
        var options = {gradeId: gradeId,
            COURSE_EXAM_TYPES: 1};

        CourseService.all(options).then(function(response) {
            $scope.courses = response.data.courses;
            $scope.courseExaminationTypes = response.data.examinationTypes;
        });
    }

    $scope.courseChanged = function() {
        $scope.showGradeExaminationTypes = false;
        $scope.showCourseExaminationTypes = true;
    }

    $scope.showFullMarksPassMarksFields = function () {
        $scope.showFullMarksField = true;
        $scope.showPassMarksField = true;
    }

   // INITIALIZATION//
    $scope.init = function(){
        $scope.loadAllGrades();
        // $scope.loadAllRooms();
        // $scope.loadAllCourses();
    }
    $scope.init();
});

(function () {
    app.controller('ExaminationListCardsController', ['$scope','$controller', 'ExaminationService', '$mdDialog', '$stateParams','ToastService', function ($scope, $controller, ExaminationService, $mdDialog,  $stateParams, ToastService) {
        angular.extend(this, $controller('FilterDBStoreController', {$scope: $scope}));
        $scope.loadAll = function () {
            var allDisplayIDs = $scope.mainFilter.getListOfEntityIDsToShow();
            if(allDisplayIDs !== undefined && allDisplayIDs.length > 0){
                var multipleIDSearch = {findByIds: allDisplayIDs.join(',')};
                ExaminationService.all(multipleIDSearch).then(
                    function (response) {
                        $scope.examinations = response.data;
                        console.log($scope.examinations);
                    });
            }
        }

        $scope.myParentExamId = undefined;
        $scope.examinationListCard = {};

        $scope.showChildExams = function(id) {
            if($scope.myParentExamId) {
                $scope.myParentExamId = undefined;
            }
            else {
                $scope.myParentExamId = id;
            }
        }

        $scope.examinationListCard.UI = {flag: {}, click: {}};
        $scope.examinationListCard.UI.click.showMakeExaminationPublicDialog = function(ev, options){
            // Demo :: https://material.angularjs.org/latest/demo/dialog
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title("Are you sure to make this exam public?")
                .textContent("Once you make exam public, marks for associated users will be created")
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(
                function(result) {
                    var examinationModel = {
                        id: options['id'],
                        validator: 'MAKE-EXAMINATION-PUBLIC',
                    }

                    ExaminationService.update(examinationModel).then(function (response) {
                        alert('examination made public');
                    },function(rejection){

                    })
                },

                function() {
                    // Cancel
                });
        }


        $scope.stateParams = $stateParams;

        $scope.examinationListCardDelete = function (param, event) {
            var textContent = "";
            if(param.type == 'mainExam') {
                textContent += "Child Exams will be deleted permanently.";
            }
            else {
                textContent += "Record will be deleted permanently.";
            }
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this examination?')
                .textContent(textContent)
                .targetEvent(event)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                ExaminationService.delete(param.id).then(function (response) {
                    if(response.status == 200){
                        ToastService.showDeleteToast('Examination');
                        location.reload();
                    }
                    else {
                        ToastService.showErrorDeleteToast('Examination');
                    }

                })

            });
        }

        //pop up create exam form
      $scope.loadExaminationForm = function (ev) {
          $mdDialog.show({
              templateUrl:'partial/examination-form',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:false
          })
              .then(function(answer) {
                  $scope.status = 'You said the information was "' + answer + '".';
              }, function() {
                  $scope.status = 'You cancelled the dialog.';
              });

      };
    }]);
})();

(function () {
    app.controller('AssignmentListCardsController', ['$scope','$controller', 'ExaminationService', function ($scope, $controller, ExaminationService) {

        $scope.loadAll = function () {


            }


    }]);
})();





app.controller('ExaminationProfileController', function ($scope, $window, $state, $stateParams, ExaminationService, $mdDialog, ProductMsgService) {
    $scope.stateParams = $stateParams;
    $scope.examination = {};
    $scope.examinationDetail = {};

    $scope.loadExaminations = function () {
        ExaminationService.get({id: $scope.stateParams.id}).then(function (response) {
            $scope.examination = response.data;
            $scope.examination.courses = response.data.courses;
            console.log($scope.examination);
        });
    }


    // UI
    $scope.examinationDetail.UI = {flag: {}, click: {}};
    $scope.examinationDetail.UI.click.showMakeExaminationPublicDialog = function(ev, options){
        // Demo :: https://material.angularjs.org/latest/demo/dialog
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title("Are you sure to make this exam public?")
            .textContent("Once you make exam public, marks for associated users will be created")
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(
            function(result) {
                var examinationModel = {
                    id: options['id'],
                    validator: 'MAKE-EXAMINATION-PUBLIC',
                }

                ExaminationService.update(examinationModel).then(function (response) {
                    $window.location.reload();
                    // $state.go('examinationDetail',{id:response.data.id});
                    // $route.reload();
                },function(rejection){

                })
            },

            function() {
                // Cancel
            });
    }

    $scope.examinationDetail.UI.click.showScheduleFormDialog = function(ev,options) {
        $mdDialog.show({
            templateUrl: 'partial/schedule-form?scheduleType=routine&forEntity=examination&forEntityId='+$scope.examination.id,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.examinationDetail.UI.click.showFileUpload = function(ev,options) {
        $mdDialog.show({
            controller: function($scope){

            },
            templateUrl: 'partial/file-upload?forEntity=examination&forEntityId='+$scope.examination.id,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.examinationDetail.UI.click.sendNotificationDialog = function(ev, options){
        // Demo :: https://material.angularjs.org/latest/demo/dialog
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
            .title("Send Message / Notice")
            .textContent("Send message to the course")
            .placeholder('type message here...')
            .ariaLabel('Message')
            // .initialValue('Buddy')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(
            function(result) {
                var msg = {};
                // msg.recipients = rec;
                msg.message = result;
                msg.examinationId = $scope.examination.id;
                msg.subject = msg.message.slice(0,20) + (msg.message.length > 20 ? '...' : ''); // Add .. only if message is greater than 20
                ProductMsgService.post(msg).then(function(response){
                    alert('Message Successfully sent to this Examination.');
                });
            },
            function() {
                // Cancel
            }
        );
    }

    $scope.loadExaminations();
});

app.controller('ExaminationDeleteController', function ($scope, $stateParams, $state, $location, ExaminationService, ToastService) {
    var stateParams = $stateParams;
    $scope.loadExamination = function () {
        ExaminationService.get({id:stateParams.id}).then(function(response) {
            $scope.examination = response.data;
        });
    }

    $scope.deleteExamination = function (param) {
        if(confirm('Are you sure ?')){
            ExaminationService.delete(param.id).then(function(response) {
                if(response.status == 200){
                    ToastService.showDeleteToast('Examination');
                    $location.path('/examination/all');
                }
                else {
                    ToastService.showErrorDeleteToast('Examination');

                }
            });
        }
    }

    $scope.cancel = function(){
        $state.go('examinationDetail',{id:stateParams.id});
    }

    $scope.loadExamination();
});

app.controller('ExaminationDiscussionController', function ($scope,$stateParams, ProductMsgService, ExaminationService) {

    $scope.threads = [];


    $scope.loadAll = function(){
        var options = {examinationId: $stateParams.examinationId};

        ProductMsgService.query(options).then(function(response) {
            $scope.threads = response.data;
            console.log($scope.threads);
        });

        ExaminationService.get({id:$stateParams.id}).then(function(response) {
            $scope.examination = response.data;
        });

    }
    $scope.loadAll();

});

app.controller('ExaminationAttendanceController', function ($scope, $stateParams, ExaminationService) {

    $scope.stateParams = $stateParams;
    $scope.examination = {};
    $scope.loadExamination = function () {
        ExaminationService.get({id: $scope.stateParams.id}).then(function (response) {
            $scope.examination = response.data;
            $scope.examination.courses = response.data.courses[0].courseUser;

        });
    }
    $scope.loadExamination();
});
app.controller('MainExaminationAttendanceController', function ($scope, $stateParams, ExaminationService) {

    $scope.stateParams = $stateParams;
    $scope.examination = {};
    $scope.loadExamination = function () {
        ExaminationService.get({id: $scope.stateParams.id}).then(function (response) {
            $scope.examination = response.data;
            $scope.examination.exam = response.data.childExam;
            $scope.examination.exam.users = response.data.childExam[0].users;
            $scope.items=$scope.examination.exam.users.length;
            console.log($scope.examination.exam);

        });
    }
    $scope.loadExamination();
});


app.controller('ExaminationReportOptionsController', function ($scope, $state, $http, $window, $stateParams, GradeService, UserService, ExaminationService, PrintService) {

    $scope.grades = {};
    $scope.users = {};
    $scope.examinations = {};
    $scope.selectedGrade = undefined;
    $scope.selectedUser = undefined;
    $scope.selectedExamination = undefined;
    $scope.selectedChildExamination = undefined;
    $scope.selectedExaminationId = undefined;
    $scope.examinationListed = false;
    $scope.userListed = false;
    $scope.generatedReports = [];

    $scope.reportType = null;
    $scope.result = {};

    // load from services
    $scope.loadGrades = function () {
        GradeService.all().then(function(response) {
           $scope.grades = response.data.grades;
        });
    }

    $scope.loadUsers = function (gradeId) {
        //user belonging to examID
        var options = {gradeId: gradeId};

        UserService.all(options).then(function(response) {
            $scope.users = response.data;
        });
    }

    $scope.loadExaminations = function (gradeId) {
        var options = {gradeId: gradeId};

        ExaminationService.query(options).then(function (response) {
            $scope.examinations = response.data;
            console.log($scope.examinations);
        });
    }

    // trigger list (On click events)
    $scope.triggerExaminations = function () {
        if($scope.selectedGrade) {
            if(!$scope.examinationListed) {
                //if not loaded
                $scope.loadExaminations($scope.selectedGrade);
                $scope.examinationListed = true;
            }
        }
    }


    $scope.triggerUsers = function () {
        if($scope.selectedGrade && $scope.selectedExamination) {//if both selected
            //user of grade is same as the user of
            // examination belonging to the same grade..
            if(!$scope.userListed) {
                $scope.loadUsers($scope.selectedGrade);
                $scope.userListed = true;
            }

        }
    }


    // mark selected (onChange Events)
    $scope.gradeSelected = function (selectedGrade){
        if(selectedGrade) {
            $scope.selectedGrade = selectedGrade;
            //if already loaded lists then
            // refresh them as grade changes
            if($scope.examinationListed) {
                $scope.reportType = null;
                if($scope.userListed) {
                    // reset user list
                    $scope.users = null;
                    $scope.userListed = false;
                    $scope.selectedUser = undefined;

                }
                // reset examination list
                $scope.selectedExamination = undefined;
                $scope.examinations = null;
                $scope.examinationListed = false;
            }
        }
    }

    $scope.examinationSelected = function (selectedExamination){
        if(selectedExamination) {
            $scope.selectedExaminationId = selectedExamination['id'];
            $scope.checkReportType();
        }
    }

    $scope.childExaminationSelected = function (selectedChildExamination) {
        if(selectedChildExamination) {
            $scope.selectedExaminationId = selectedChildExamination;
            $scope.checkReportType();
        }
    }

    $scope.userSelected = function (selectedUser){
        if(selectedUser) {
            $scope.selectedUser = selectedUser;
            //check report type
            $scope.checkReportType();
        }
    }

    $scope.checkReportType = function () {
        if(!isNaN($scope.selectedGrade) && !isNaN($scope.selectedExaminationId) && !isNaN($scope.selectedUser)) {
             //grade, examination and user represents individual reports
            $scope.reportType = "INDIVIDUAL-REPORT";
            // console.log('individual report');
        }
        else if(!isNaN($scope.selectedGrade) && !isNaN($scope.selectedExaminationId)) {
            //grade and examination represents bulk report of students
            $scope.reportType = "BULK-REPORT";
            // console.log('bulk report');

        }
    }

    $scope.generateReport = function () {
           if($scope.reportType == "BULK-REPORT") {
               //examId
               var param = {
                   examId: $scope.selectedExaminationId,
               }
               $window.open('api/print/examinationReport/'+ param['examId']);
           }
           else if($scope.reportType == "INDIVIDUAL-REPORT") {
               //examId and userId
               var param = {
                examId: $scope.selectedExaminationId,
                userId: $scope.selectedUser
               }
               //open relevant api in new tab
               // which is used to generate report
               $window.open('api/print/user/'+ param['userId'] +'/examinationReport/'+ param['examId']);

           }
    }

    $scope.getReports = function () {
        $http.get('/api/generated-reports')
            .then(function (response) {
                $scope.generatedReports = JSON.parse(response.data);
            });
    }

    $scope.deleteReport = function (id) {
        $http.get('/api/delete-report/' + id)
            .then(function (response) {
                if (response.data) {
                    alert('Report successfully deleted.');
                } else {
                    alert('Error deleting Report.');
                }

                window.location.reload();
            })
    }

    $scope.loadGrades();//load grades by default
    $scope.getReports();
});



app.controller('ExaminationTypesController', function ($scope, ExaminationTypesService, ToastService, $mdDialog) {

    $scope.editState = false;
    $scope.headerText = "Create";

    $scope.createExaminationType = function () {
        var examinationType = {
            name: $scope.name,
            type: $scope.type
        }

        ExaminationTypesService.post(examinationType).then(function (response) {
            if (response.status == '200') {
                //clean the form
                $scope.name = "";
                $scope.type = "";
                ToastService.showSuccessToast('Examination Type');
                $scope.loadTypes();

            } else {
                $scope.name = "";
                $scope.type = "";
                ToastService.showErrorToast("Examination Type");
            }
        })
        // console.log(examinationType);
    }

    $scope.editExaminationType = function (examination) {
        $scope.headerText = "Edit";
        $scope.editState = true;
        $scope.id = examination.id;
        $scope.name = examination.name;
        $scope.type = examination.type;
    }


    $scope.edit = function () {
        var examinationType = {
            id: $scope.id,
            name: $scope.name,
            type: $scope.type
        }
        ExaminationTypesService.update(examinationType).then(function (response) {
            if (response.status == '200') {
                $scope.loadTypes(); //refresh data..
                ToastService.showUpdateToast('Examination Type');
                $scope.headerText = "Create";
                $scope.editState = false;
                $scope.id = "";
                $scope.name = "";
                $scope.type = "";
            }
        })
    }

    $scope.delete = function (ev, examinationType) {
        var confirm = $mdDialog.confirm()
          .title('Are you sure to delete this examination type?')
          .textContent('This will delete all exams associated with this type')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(function() {
            ExaminationTypesService.delete(examinationType.id).then(function (response) {
                if (response.status == '200') {
                    ToastService.showDeleteToast('Examination Type');
                    $scope.loadTypes();
                }

            })
        }, function() {
          //do nothing for no..
        });
    }

    $scope.cancel = function () {
        $scope.headerText = "Create";
        $scope.editState = false;
        $scope.id = "";
        $scope.name = "";
        $scope.type = "";
    }

  $scope.loadTypes = function () {
     ExaminationTypesService.all().then(function (response) {
        $scope.examinationTypes = response.data;
        $scope.types = response.types;
    });
 }


 $scope.loadTypes();
});
(function () {
    app.directive('examinationDetailInfoCard', function() {

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                examination: '=examination'
            },

            templateUrl:  'partial/examination-detail-info-card',

            link: function(scope, elem, attrs) {
            },

            controller : ['$scope','PrintService', function ($scope, PrintService) {
                $scope.printCard = function(param){
                    PrintService.printExamination({id:param['id']});
                }
            }],

        };
    });

})();
app.factory('ExaminationRESTClient', function ($resource) {
     return $resource('api/examination/:id', {id: '@id', examination: '@examination'}, {
          'query': {method: 'GET', isArray: false },
          'update' : {method: 'PUT', params:{examination : '@examination'}, isArray: false},
          'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
     });
});

app.factory('ExaminationTypesRESTClient', function ($resource) {
     return $resource('api/examinationTypes/:id', {id: '@id', examination: '@examination'}, {
          'query': {method: 'GET', isArray: false },
          'update' : {method: 'PUT', params:{examination : '@examination'}, isArray: false},
          'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
     });
});
var ExaminationService = app.service('ExaminationService', function (ExaminationRESTClient) {
	return {
		query: function(options){
			return ExaminationRESTClient.query(options).$promise;
		},

		get: function(id) {
			return ExaminationRESTClient.get({id:id.id}).$promise;
		},

		getEdit:function(id){
			return ExaminationRESTClient.getEdit({id:id.id})
		},

		post: function(examination){
			return ExaminationRESTClient.save(examination).$promise;
		},

		delete: function(id){
			return ExaminationRESTClient.delete({id:id}).$promise;
		},

		all: function(){
			return ExaminationRESTClient.query().$promise;
		},

		update: function(examination){
			return ExaminationRESTClient.update(examination).$promise;
		}
	}
});
var ExaminationTypesService = app.service('ExaminationTypesService', function (ExaminationTypesRESTClient) {
	return {
		query: function(options){
			return ExaminationTypesRESTClient.query(options).$promise;
		},

		get: function(id) {
			return ExaminationTypesRESTClient.get({id:id.id}).$promise;
		},

		getEdit:function(id){
			return ExaminationTypesRESTClient.getEdit({id:id.id})
		},

		post: function(examination){
			return ExaminationTypesRESTClient.save(examination).$promise;
		},

		delete: function(id){
			return ExaminationTypesRESTClient.delete({id:id}).$promise;
		},

		all: function(){
			return ExaminationTypesRESTClient.query().$promise;
		},

		update: function(examination){
			return ExaminationTypesRESTClient.update(examination).$promise;
		}
	}
});
app.controller('TestTheController', ['$scope', '$controller', 'ProductFileService', function ($scope, $controller, ProductFileService) {
    angular.extend(this, $controller('FilterDBStoreController', {$scope: $scope}));

    $scope.productFiles = [];

    $scope.loadAll = function () {
        ProductFileService.all().then(function (response) {
            $scope.productFiles = response.data;
        });
    }


    $scope.loadAll();

}]);


app.factory('ProductFileRESTClient', function ($resource) {
    return $resource('api/file/:id', {id: '@id',file: '@file'}, {
        'query': {method: 'GET', isArray: false },
        'update' : {method: 'PUT', params:{address : '@file'}, isArray: false},
        'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
    });
});
var ProductFileService = app.service('ProductFileService', function (ProductFileRESTClient) {
    return {
        get: function(id) {
            return ProductFileRESTClient.get({id:id.id}).$promise;
        },

        post: function(productFile){
            return ProductFileRESTClient.save(productFile).$promise;
        },

        delete: function(id){
            return ProductFileRESTClient.delete({id:id}).$promise;
        },

        all: function(){
            return ProductFileRESTClient.query().$promise;
        },

        update: function(productFile){
            return ProductFileRESTClient.update(productFile).$promise;
        }

        

    }
});
/**
 * Created by sadhikari on 9/6/2016.
 */
(function () {
    app.controller('FilterDBStoreController', function ($scope, FilterDBStore) {
        $scope.mainFilter = {};
        $scope.filterStore = [];
        $scope.latestResult = [];
        $scope.lastFilterApplied = '0000-00-00';

        var changeLastFilterApplied = function(){
            $scope.lastFilterApplied = JSON.stringify(new Date());
        }

        $scope.mainFilter = {storage:{}};

        $scope.mainFilter.reset = function(){
            var newPageSize = angular.isDefined($scope.mainFilter.storage.pageSize) && !isNaN($scope.mainFilter.storage.pageSize) ? $scope.mainFilter.storage.pageSize : 5 ;
            $scope.mainFilter.storage = {
                store: [],
                currentPosition: 0,
                maxPageSize: 500,
                pageSize:newPageSize,
            };
        }
        $scope.mainFilter.reset();

        $scope.mainFilter.syncFilter = function(){
            //Pagination Resize
            const backup = $scope.mainFilter.storage.store;
            var allPagesIds = [].concat.apply([], $scope.mainFilter.storage.store); // Collecting
            var allUniqueIds = allPagesIds.filter(function(item, i, ar){ return ar.indexOf(item) === i; }); // Making Unique
            try{
                $scope.mainFilter.storage.store = allUniqueIds.__chunk(Number($scope.mainFilter.storage.pageSize)); // Creating new array of pages
            }catch(error) {
                $scope.mainFilter.storage.store = backup; // Maybe redundant???
            }
        }


        $scope.mainFilter.paginator = {
            //Settings
            changePageSize: function(newPageSize){
                if(!isNaN(newPageSize) || newPageSize > $scope.mainFilter.storage.maxPageSize){return false;}
                $scope.mainFilter.storage.pageSize = newPageSize;
                return true;
            },

            // Navigation
                next: function () {

                if($scope.mainFilter.storage.currentPosition < ($scope.mainFilter.storage.store.length-1)){
                    $scope.mainFilter.storage.currentPosition = ($scope.mainFilter.storage.currentPosition + 1);
                    return $scope.mainFilter.storage.currentPosition;
                }
            },
            page: function (index) {
              $scope.mainFilter.storage.currentPosition = index;
              return $scope.mainFilter.storage.currentPosition;
            },

                previous: function () {
                if($scope.mainFilter.storage.currentPosition > 0){
                    $scope.mainFilter.storage.currentPosition = ($scope.mainFilter.storage.currentPosition - 1);
                    return $scope.mainFilter.storage.currentPosition;
                }

            }


            };

            // circle: function(){
            //     if($scope.mainFilter.storage.currentPosition === $scope.mainFilter.storage.store.length){
            //         $scope.mainFilter.storage.currentPosition = 0;
            //         return 0;
            //     }
            //
            //
            // }


        $scope.mainFilter.UI = {
            flag:{

            },
            click:{
                previous: function(){
                    return $scope.mainFilter.paginator.previous();
                },
                next: function(){
                    return $scope.mainFilter.paginator.next();
                },
                page:function(index){
                    return $scope.mainFilter.paginator.page(index);
                },
                changePageSize:function (newValue) {
                    return $scope.mainFilter.paginator.changePageSize(newValue);
                }

            },
        };

        $scope.filterSuccessStore = function(data){
            changeLastFilterApplied();
            // Reset FilterStore
            $scope.mainFilter.reset();
            $scope.latestResult = FilterDBStore.update($scope.filterStore,
                                                data.filterId,
                                                data.filterValue,
                                                data.filterResult);
        }

        $scope.mainFilter.getPosition = function(index){
            if(isNaN(index)){
                return 0;
            }
           return ($scope.mainFilter.storage.currentPosition * $scope.mainFilter.storage.pageSize) + index;
        }

        $scope.mainFilter.filterID = function(entity){
            var showEntity =  FilterDBStore.filter($scope.latestResult, angular.isDefined(entity['id']) ? entity['id'] : "");
            return showEntity;
        },

        $scope.mainFilter.getPages = function(){
            return $scope.mainFilter.storage.store;
        }

        $scope.mainFilter.getCurrentPage = function(){
            return $scope.mainFilter.storage.currentPosition + 1;
        }

        $scope.mainFilter.getResultSize = function(){
            if($scope.mainFilter.storage.store.length > 1){
                return ($scope.mainFilter.storage.store.length - 2) * $scope.mainFilter.storage.pageSize + $scope.mainFilter.storage.store[ ($scope.mainFilter.storage.store.length - 1)].length;
            }else if($scope.mainFilter.storage.store.length === 1){
                return $scope.mainFilter.storage.store[0].length;
            }else{
                return 0;
            }
        }

        $scope.mainFilter.getListOfEntityIDsToShow = function(){
            if($scope.mainFilter.storage.store.length > 0 ){
                var result = $scope.mainFilter.storage.store[$scope.mainFilter.storage.currentPosition];
                return result;
            }
            return [];
        }

        // Trigger Reload of Datas by IDs
        $scope.$watch('latestResult', function(newValue, oldValue) {
            $scope.mainFilter.storage.store = $scope.latestResult.__chunk($scope.mainFilter.storage.pageSize);
            $scope.mainFilter.syncFilter();
            $scope.loadAll();
        });

        $scope.$watch('mainFilter.storage.currentPosition', function(newValue, oldValue) {
            $scope.loadAll();
        });

        // Once page size changes gather all the ids from all pages and create new array of pages
        $scope.$watch('mainFilter.storage.pageSize', function(newValue, oldValue) {
            $scope.mainFilter.storage.currentPosition = 0;
            $scope.mainFilter.syncFilter();
            $scope.loadAll();
        });

    });
})();
/**
 * Created by sadhikari on 11/5/2016.
 */
(function () {
    app.service('FilterDBStore', function () {

        const CURRENT = 'x-data_CURRENT-FILTER';
        const CURRENT_VALUE = 'x-data_CURRENT-FILTER-VALUE';

        return {

            filter: function(latestResult, value){
                if(latestResult.indexOf(value) > -1){
                    return true;
                }
                return false;
            },

            getListOfEntityIDsToShow: function(latestResult){
              return latestResult;
            },

            // FilterStore is an array that stores all the filter Result
            update: function(filterStore,
                            filterId,
                            filterValue,
                            filterResult){
                if(filterStore[filterId] === undefined){
                    filterStore[filterId] = {};
                }

                filterStore[filterId][filterValue] = filterResult;

                filterStore[filterId][CURRENT_VALUE] = filterValue;
                return this.refreshAndGetLatestResult(filterStore);
            },

            refreshAndGetLatestResult: function(filterStore){
                var allResult = [];
                for(var filterName in filterStore) {
                    var activeFilterValue = filterStore[filterName][CURRENT_VALUE];
                    allResult.push(filterStore[filterName][activeFilterValue]);
                }
                console.log(filterStore);
                return this.findIntersection(allResult);
            },

            // http://codereview.stackexchange.com/questions/96096/find-common-elements-in-a-list-of-arrays
            findIntersection: function(arrays){

                var currentValues = {};
                var commonValues = {};
                for (var i = arrays[0].length-1; i >=0; i--){//Iterating backwards for efficiency
                    currentValues[arrays[0][i]] = 1; //Doesn't really matter what we set it to
                }
                for (var i = arrays.length-1; i>0; i--){
                    var currentArray = arrays[i];
                    for (var j = currentArray.length-1; j >=0; j--){
                        if (currentArray[j] in currentValues){
                            commonValues[currentArray[j]] = 1; //Once again, the `1` doesn't matter
                        }
                    }
                    currentValues = commonValues;
                    commonValues = {};
                }

                return Object.keys(currentValues).map(function(value){
                    return parseInt(value);
                });

            }

        }
    });
})();
/**
 * #####################################################################################################################
 * ####################################filterUserByStatus###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterUserByStatus', function() {
        var filterId = 'filterUserByStatus';

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },

            template:   '<label for="'+filterId+'">Status </label>'+
                        '<select name="'+filterId+'" ng-model="filterValue">' +
                        '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.status">' +
                        '{{filterOption.status}}' +
                        '</option>' +
                        '</select>',

            link: function(scope, elem, attrs) {

                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                if(!scope.pickListLoaded){
                    scope.loadFilterPickList();
                }
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                var pluckID = function (data){
                    return data['userId'];
                }

                $scope.pickListLoaded = false;
                $scope.loadFilterPickList = function () {
                    FilterService.filterUserByStatus().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterUserByStatus(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,filterValue:$scope.filterValue,filterResult:response.data.data};
                        var filterValue = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterValue.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterValue;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){

                }

            }],
        };
    });

})();

/**
 * #####################################################################################################################
 * ####################################filterUserByCourse###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterUserByCourse', function() {
        var filterId = 'filterUserByCourse';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Course </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            'gradeId: {{filterOption.grade_id}} : {{filterOption.name}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['userId'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterUserByCourse().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    console.log(filterValue);
                    FilterService.filterUserByCourse(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                                                filterValue:$scope.filterValue,
                                                filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });

                        filterSuccessData.filterResult = filterIDs;

                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();


/**
 * #####################################################################################################################
 * ####################################filterUserByGrade###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterUserByGrade', function() {
        var filterId = 'filterUserByGrade';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },

            template:   '<label for="'+filterId+'">Grade </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" value="{{filterOption.id}}" >' +
            '{{filterOption.name}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });
                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                var pluckID = function (data){
                    return data['userId'];
                }

                $scope.pickListLoaded = false;
                $scope.loadFilterPickList = function () {
                    FilterService.filterUserByGrade().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterUserByGrade(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,filterValue:$scope.filterValue, filterResult:response.data.data};
                        var filterValue = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterValue.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterValue;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

(function () {
    app.directive('filterUserByRole', function() {
        var filterId = 'filterUserByRole';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },

            template:   '<label for="'+filterId+'">Role </label>'+
                        '<select name="'+filterId+'" ng-model="filterValue">' +
                        '<option ng-model="filterOptions[0].id" ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
                        '{{filterOption.name}}'  +
                        '</option>' +
                        '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });


                elem.bind('ready',function(scope){
                    console.log('ready called');
                    scope.triggerFilter(scope.filterOptions[0].id);
                });

                // elem.bind('click', function() {
                    // if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    // }
                // });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.filterOptions = [];

                var pluckID = function (data){
                    return data['userId'];
                }


                $scope.filterDefaultOption =  $scope.filterOptions[0] ? $scope.filterOptions[0].id : "" || "" ;

                $scope.loadFilterPickList = function () {
                    FilterService.filterUserByRole().then(function(response){
                        $scope.filterOptions = response.data.data;
                        // setTimeout(function(){console.log($scope.triggerFilter($scope.filterOptions[0]['id']))},100);
                    });

                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterUserByRole(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,filterValue:$scope.filterValue,filterResult:response.data.data};
                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                    $scope.filterValue = 'ALL';
                    FilterService.getAllUsers().then(function (response) {
                        var filterSuccessData = {filterResult:response.data.data};
                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    })
                }

                $scope.init();
            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterAttendanceByUser###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterAttendanceByUser', function() {
        var filterId = 'filterAttendanceByUser';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterOptions: '=?filterOptions',
                filterSuccess: '=filterSuccess',
            },

            template:   '<label for="'+filterId+'">User</label>'+
                        '<select name="'+filterId+'" ng-model="filterValue">' +
                        '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
                        '{{filterOption.userId}}'+
                        '</option>' +
                        '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });
                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });

            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['attendanceId'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterAttendanceByUser().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterAttendanceByUser(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,filterValue:$scope.filterValue,filterResult:response.data.data};


                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){

                }
            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterMarkByCourse###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterMarkByCourse', function() {
        var filterId = 'filterMarkByCourse';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Course </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}} : {{filterOption.name}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['markId'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterMarkByCourse().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterMarkByCourse(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterTransactionByUser###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterTransactionByUser', function() {
        var filterId = 'filterTransactionByUser';
        var pluckID = function (data){
            return data['transactionId'];
        }
        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterOptions: '=?filterOptions',
                filterSuccess: '=filterSuccess'
            },

            template:   '<label for="'+filterId+'">User</label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.user_id}}'+
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });
                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });

            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                $scope.loadFilterPickList = function () {
                    FilterService.filterTransactionByUser().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterTransactionByUser(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){

                }
            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterTransactionByGrade###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterTransactionByGrade', function() {
        var filterId = 'filterTransactionByGrade';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },

            template:   '<label for="'+filterId+'">Grade </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}}' + ' : ' + '{{filterOption.name}}' + '({{filterOption.shortName}})' + ' {{filterOption.section}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });
                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                var pluckID = function (data){
                    return data['transactionId'];
                }

                $scope.pickListLoaded = false;
                $scope.loadFilterPickList = function () {
                    FilterService.filterTransactionByGrade().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterTransactionByGrade(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,filterValue:$scope.filterValue, filterResult:response.data.data};
                        var filterValue = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterValue.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterValue;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

 /* ####################################filterExaminationByGrade###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterExaminationByGrade', function() {
        var filterId = 'filterExaminationByGrade';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Grade </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" value="{{filterOption.id}}" >' +
            '{{filterOption.name}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['examinationId'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterExaminationByGrade().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterExaminationByGrade(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                    $scope.filterValue = 'ALL';
                    FilterService.getAllExam().then(function (response) {
                        var filterSuccessData = {filterResult:response.data.data};
                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    })
                }

                $scope.init();


            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterExaminationByCourse###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterExaminationByCourse', function() {
        var filterId = 'filterExaminationByCourse';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Course </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            'gradeId: {{filterOption.grade_id}} : {{filterOption.name}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterExaminationByCourse().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterExaminationByCourse(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterMarksByExamination###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterMarksByExamination', function() {
        var filterId = 'filterMarksByExamination';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Examination </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}}' + ' : ' + '({{filterOption.name}})' + '({{filterOption.type}})' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterMarksByExamination().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterMarksByExamination(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterMarksByUser###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterMarksByUser', function() {
        var filterId = 'filterMarksByUser';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">User </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.userId}} ' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterMarksByUser().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterMarksByUser(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterMarksByGrade###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterMarksByGrade', function() {
        var filterId = 'filterMarksByGrade';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Grade </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}}' + ' : ' + '{{filterOption.name}}' + '({{filterOption.shortName}})' + ' {{filterOption.section}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['markId'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterMarksByGrade().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterMarksByGrade(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterAttendanceByGrade###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterAttendanceByGrade', function() {
        var filterId = 'filterAttendanceByGrade';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Grade </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}}' + ' : ' + '{{filterOption.name}}' + '({{filterOption.shortName}})' + ' {{filterOption.section}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterAttendanceByGrade().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterAttendanceByGrade(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterAttendanceByExamination###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterAttendanceByExamination', function() {
        var filterId = 'filterAttendanceByExamination';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Examination </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}}' + ' : ' + '({{filterOption.name}})' + '({{filterOption.type}})' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterAttendanceByExamination().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterAttendanceByExamination(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterAttendanceByCourse###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterAttendanceByCourse', function() {
        var filterId = 'filterAttendanceByCourse';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Course </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}} : {{filterOption.name}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterAttendanceByCourse().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterAttendanceByCourse(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterFileByUser###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterFileByUser', function() {
        var filterId = 'filterFileByUser';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">User </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.userId}} ' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterFileByUser().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterFileByUser(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();


/**
 * ####################################filterFileByGrade###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterFileByGrade', function() {
        var filterId = 'filterFileByGrade';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Grade </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}}' + ' : ' + '{{filterOption.name}}' + '({{filterOption.name}})' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterFileByGrade().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterFileByGrade(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();
/**
 * #####################################################################################################################
 * ####################################filterFileByExamination###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterFileByExamination', function() {
        var filterId = 'filterFileByExamination';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Examination </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}}' + ' : ' + '({{filterOption.name}})' + '({{filterOption.type}})' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterFileByExamination().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterFileByExamination(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();


/**
 * #####################################################################################################################
 * ####################################filterFileByCourse###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterFileByCourse', function() {
        var filterId = 'filterFileByCourse';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Course </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}} : {{filterOption.name}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterFileByCourse().then(function(response){
                        $scope.filterOptions = response.data.data;
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterFileByCourse(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterUserByString###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterUserByString', function () {
        var filterId = 'filterUserByString';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:'<input type="text" ng-model="filterValue" placeholder="Search" style="background-color: white; margin-top: 5px;">' +
            '</input>',

            link: function (scope, elem, attrs) {
                elem.bind('input', function () {
                    scope.triggerFilter(scope.filterValue);
                });

            },

            controller: ['$scope', 'FilterService', '$timeout', function ($scope, FilterService, $timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data) {
                    return data['userId'];
                }

                $scope.triggerFilter = function (filterValue) {
                    FilterService.filterUserByString(filterValue).then(function (response) {
                        var filterSuccessData = {
                            filterValue: $scope.filterValue,
                            filterResult: response.data.data
                        };
                        document.getElementById('searchResult').innerHTML = '<li>haha</li>';
                        $scope.result = response.data.data;
                        console.log(response.data.data);

                        // var filterIDs = [];
                        // filterSuccessData.filterResult.forEach(function (element) {
                        //     filterIDs.push(pluckID(element));
                        // });
                        // filterSuccessData.filterResult = filterIDs;
                        // $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function () {
                }

            }],
        };
    });
})();

/**
 * #####################################################################################################################
 * ####################################filterFileByUser###############################################################
 * #####################################################################################################################
 */
(function () {
    app.directive('filterCourseAttendanceByMonth', function() {
        var filterId = 'filterCourseAttendanceByMonth';

        return {
            restrict: 'A',

            transclude: false,

            scope: {
                filterSuccess: '=filterSuccess',
            },


            template:   '<label for="'+filterId+'">Month </label>'+
            '<select name="'+filterId+'" ng-model="filterValue">' +
            '<option ng-repeat="filterOption in filterOptions" ng-value="filterOption.id" >' +
            '{{filterOption.id}} : {{filterOption.status}}' +
            '</option>' +
            '</select>',

            link: function(scope, elem, attrs) {
                elem.bind('change', function() {
                    scope.triggerFilter(scope.filterValue);
                });

                elem.bind('click', function() {
                    if(!scope.pickListLoaded){
                        scope.loadFilterPickList();
                    }
                });
            },

            controller : ['$scope','FilterService','$timeout', function ($scope, FilterService,$timeout) {
                $scope.pickListLoaded = false;

                var pluckID = function (data){
                    return data['id'];
                }

                $scope.loadFilterPickList = function () {
                    FilterService.filterCourseAttendanceByMonth().then(function(response){
                        $scope.filterOptions = response.data.data;
                        console.log(response);
                        $scope.pickListLoaded = true;
                    });
                };

                $scope.triggerFilter = function(filterValue){
                    FilterService.filterCourseAttendanceByMonth(filterValue).then(function(response){
                        var filterSuccessData = {filterId:filterId,
                            filterValue:$scope.filterValue,
                            filterResult:response.data.data};

                        var filterIDs = [];
                        filterSuccessData.filterResult.forEach(function(element) {
                            filterIDs.push(pluckID(element));
                        });
                        filterSuccessData.filterResult = filterIDs;
                        $scope.filterSuccess(filterSuccessData);
                    });
                }

                // ######### Initialization ######### //
                $scope.init = function(){
                }

            }],
        };
    });
})();
/**
 * Created by sadhikari on 11/7/2016.
 */

/**
 * Created by sadhikari on 9/6/2016.
 */


var FilterService = app.service('FilterService', function ($http) {

    var apiURI = 'api/filter';

    return {

        filterUserByStatus: function(value){
            var comparisonOp = "=";
            var filterId = 'filterUserByStatus';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterUserByCourse: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterUserByCourse';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterUserByRole: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterUserByRole';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        getAllUsers: function() {
            var comparisonOp = '=';
            var filterId = 'getAllUsers';

            var params = {id:filterId};

            params.params = 'all';
            params.comparisonOp = comparisonOp;
            

            return $http
            .get(apiURI,{
                params:params
            });
        },

        filterUserByGrade: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterUserByGrade';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterCourseByGrade: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterCourseByGrade';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterAttendanceByUser: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterAttendanceByUser';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterMarkByCourse: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterMarkByCourse';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },


        filterTransactionByUser: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterTransactionByUser';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterTransactionByGrade: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterTransactionByGrade';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterExaminationByGrade: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterExaminationByGrade';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        getAllExam: function() {
            var comparisonOp = '=';
            var filterId = 'getAllExam';

            var params = {id:filterId};

            params.params = 'all';
            params.comparisonOp = comparisonOp;


            return $http
                .get(apiURI,{
                    params:params
                });
        },


        filterExaminationByCourse: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterExaminationByCourse';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterMarksByExamination: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterMarksByExamination';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterMarksByUser: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterMarksByUser';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterMarksByGrade: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterMarksByGrade';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterAttendanceByGrade: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterAttendanceByGrade';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterAttendanceByExamination: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterAttendanceByExamination';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterAttendanceByCourse: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterAttendanceByCourse';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterCourseAttendanceByMonth: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterCourseAttendanceByMonth';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterFileByUser: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterFileByUser';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterFileByGrade: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterFileByGrade';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterFileByExamination: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterFileByExamination';

            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterFileByCourse: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterFileByCourse';


            var params = {id:filterId};

            if(value === undefined){
                params.getFilterPickList = true;
            }else{
                params.params = value;
                params.comparisonOp = comparisonOp;
            }

            return $http
                .get(apiURI,{
                    params:params
                });
        },

        filterUserByString: function(value) {
            var comparisonOp = '=';
            var filterId = 'filterUserByString';


            var params = {id:filterId};
            params.params = value;
            params.comparisonOp = comparisonOp;

            return $http
                .get(apiURI,{
                    params:params
                });
        },
    }

});
app.controller('GradeController', function ($scope, GradeService, SessionService) {
    $scope.loadGrade = function () {
        GradeService.get({id:1}).then(function(response) {
            $scope.grade = response.data;
        });
    }
    $scope.loadGrade();
});

app.controller('GradeFormController', function ($scope, $stateParams, ToastService, GradeService, $location, $state, $mdDialog) {
    $scope.grade = {};
    $scope.stateParams = $stateParams;
    var stateParams = $stateParams;


    $scope.getGradeModel = function(){
        var grade = {
            name:$scope.grade.name,
            shortName:$scope.grade.shortName,
            section:$scope.grade.section,
            year:$scope.grade.year,
            semester:$scope.grade.semester,
            trimester:$scope.grade.trimester,
            month:$scope.grade.month,
            details:$scope.grade.details,
            parentGradeId:$scope.grade.parentGradeId,
        }

        if($scope.grade.id){
            grade['id'] = $scope.grade.id;
        }
        return grade;
    }


   $scope.createGrade = function () {
        // if ( confirm('Are you sure to create grade?')) {
       GradeService.post($scope.getGradeModel()).then(function (response)  {
           if(response.status == 200){
               ToastService.showSuccessToast('Grade');
               $mdDialog.hide();
               location.reload();
           }
           else {
               ToastService.showErrorToast('Grade');
           }

            });

    }

    $scope.cancelGrade = function(){
        $mdDialog.hide();

    }

    // EDIT Section //
    $scope.loadGradeForEdit = function () {
        console.log('gradeId'+$scope.gradeId);
        GradeService.get({id:$scope.gradeId}).then(function(response){
            $scope.grade = response.data;
            console.log($scope.grade);
        });
    }


    // $scope.editState = false;
    // if($scope.stateParams.actionParams.action === 'edit'){
    //     $scope.editState = true;
    //     $scope.loadGradeForEdit();
    // }

    if ($scope.editState == true) {
        //came from grade-dialog
        $scope.loadGradeForEdit();
    }

    $scope.edit = function(){
        GradeService.update($scope.getGradeModel()).then(function (response) {
            if(response.status == 200){
                ToastService.showUpdateToast('Grade');
                $mdDialog.hide();
                location.reload();
            }
            else {
                ToastService.showErrorUpdateToast('Grade');
            }

        });
    }

    $scope.cancel = function(){
        $mdDialog.hide();
    }
});



app.controller('GradeUserFormController', function ($scope, $stateParams,CourseService, GradeService, UserService,FilterService, $state) {
    $scope.grades = {};
    $scope.user;
    $scope.gradeUser = {};
    $scope.stateParams = $stateParams;

    $scope.loadUser = function(id){
        UserService.get(id).then(function(response){
            $scope.user = response.data;
        });
    };

    $scope.loadAllGrades = function(){
        GradeService.all().then(function(response){
           $scope.grades = response.data.grades;
            console.log($scope.grades);
        });
    }

    $scope.getGradeUserModel = function(){
        var gradeUser = {
            userId:$scope.user.id,
            gradeId: $scope.gradeUser.gradeId,
        }
        return gradeUser;
    }

    $scope.assignGradeToUser = function () {
        var gradeModel = $scope.getGradeUserModel();
        console.log(gradeModel);
        GradeService.assignGradeToUser(gradeModel).then(function(response){
            // location.reload();
            alert('Successfully added in the system.'+'\n'+'Check console.log for response.');
            // ;
        });
    }

    $scope.loadAllGrades();
    $scope.loadUser({id:$scope.stateParams.id});

});

app.controller('RemoveGradeUserController', function ($scope, $stateParams, GradeService, UserService,FilterService, $state) {
    $scope.grades = {};
    $scope.user;
    $scope.gradeUser = {};
    $scope.stateParams = $stateParams;

    $scope.loadUser = function(id){
        UserService.get(id).then(function(response){
            $scope.user = response.data;
        });
    };

    $scope.loadAllGrades = function(){
        GradeService.all().then(function(response){
           $scope.grades = response.data
        });
    }

    $scope.getGradeUserModel = function(){
        var gradeUser = {
            userId:$scope.user.id,
            gradeId: $scope.gradeUser.gradeId,
        }
        return gradeUser;
    }

    $scope.removeGradeFromUser = function () {
        var gradeModel = $scope.getGradeUserModel()
        GradeService.removeGradeFromUser(gradeModel).then(function(response){
            alert('Successfully removed from the system.'+'\n'+'Check console.log for response.');
        });
    }

    $scope.loadAllGrades();
    $scope.loadUser({id:$scope.stateParams.id});


});



app.controller('GradeListCardsController', function ($scope, GradeService, ProductMsgService, $stateParams, ToastService, $mdDialog) {

    $scope.grades;

    $scope.gridOptions = { data: 'grades',
        columnDefs:
            [{field: 'id', displayName: 'ID', width: 50 },
                {field: 'name', displayName: 'Name'  },
                {field: 'section', displayName: 'Section'  },
            ],
        enableRowSelection: true,
        enableSelectAll: true,
        enableSorting: false,
        selectionRowHeaderWidth: 35,
        enableHorizontalScrollbar: 1,
        enableColumnResizing: true,

    };

    $scope.gradeListCard = {};

    // UI
    $scope.gradeListCard.UI = {flag:{},click:{}};
    $scope.gradeListCard.UI.click.sendNotificationDialog = function(ev, options){
        // Demo :: https://material.angularjs.org/latest/demo/dialog
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
            .title("Send Message / Notice")
            .textContent("Send message to all users of this class")
            .placeholder('type message here...')
            .ariaLabel('Message')
            // .initialValue('Buddy')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(
            function(result) {
                // var rec = $scope.grade.users.map(
                //     function(user){
                //         return (user['id'] || null) ;
                //     }
                // );
                var msg = {};
                // msg.recipients = rec;
                msg.message = result;
                msg.gradeId = options.gradeId
                msg.subject = msg.message.slice(0,20) + (msg.message.length > 20 ? '...' : ''); // Add .. only if message is greater than 20
                ProductMsgService.post(msg).then(function(response){
                    console.log(response);
                    if(response.status == 200){
                        ToastService.showSuccessMessageToast('Message');
                    }
                    else {
                        ToastService.showErrorMessageToast('Message');
                    }
                });
            },
            function() {
                // Cancel
            }
        );
    }

    $scope.stateParams = $stateParams;

    $scope.gradeListCardDelete = function (param, event) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete this Grade?')
            .textContent('Record will be deleted permanently.')
            .targetEvent(event)
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            GradeService.delete(param.id).then(function (response) {
                if(response.status == 200){
                    ToastService.showDeleteToast('Grade');
                    location.reload();
                }
                else {
                    ToastService.showErrorDeleteToast('Grade');
                }

            })

        });
    };

    $scope.loadAll = function(){
        GradeService.all().then(function(response) {
            $scope.grades = response.data.grades;
            console.log($scope.grades);
        });
    }

    $scope.deleteGrade = function (id) {
        GradeService.delete(id).then(function(response) {
            $scope.loadAll();
        });
    }



    //pop up create grade form
    $scope.loadGradeForm = function (ev) {
        $mdDialog.show({
            templateUrl: 'partial/grade-form',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.gradeEdit = function (gradeId, ev) {
        $mdDialog.show({
            targetEvent: ev,
            templateUrl: 'partial/grade-form',
            clickOutsideToClose: false,
            locals: {
                gradeId: gradeId,
                editState: true
            },
            controller: ['$scope', 'gradeId', 'editState', function($scope, gradeId, editState) {
                // share data to controll being used by partial/grade-form
                $scope.gradeId = gradeId;
                $scope.editState = editState
            }]
        });
    }

    $scope.loadAll();

});


(function () {
    app.controller('GradeDetailController', ['$scope',
        '$state',
        '$stateParams',
        'GradeService',
        'ExaminationService',
        'ScheduleService',
        '$mdDialog',
        'ProductMsgService',
        'GradeJSON',
        'ToastService',

        function GradeDetailController($scope,
                                       $state,
                                       $stateParams,
                                       GradeService,
                                       ExaminationService,
                                       ScheduleService,
                                       $mdDialog,
                                       ProductMsgService,
                                       GradeJSON,
                                       ToastService) {

            $scope.stateParams = $stateParams;
            $scope.grade = GradeJSON;
            $scope.gradeDetail = {};

            // UI
            $scope.gradeDetail.UI = {flag:{},click:{}};

            // $scope.gradeDetail.UI.click.showCreateExaminationDialog = function(ev, options){
            //     // Demo :: https://material.angularjs.org/latest/demo/dialog
            //     // Appending dialog to document.body to cover sidenav in docs app
            //     var confirm = $mdDialog.prompt()
            //         .title('Create '+options['type']+".")
            //         .textContent("You can edit the details later. Date is optional.")
            //         .placeholder('Date (2074-02-02)')
            //         .ariaLabel('Date')
            //         // .initialValue('Buddy')
            //         .targetEvent(ev)
            //         .ok('Ok')
            //         .cancel('Cancel');
            //
            //     $mdDialog.show(confirm).then(
            //         function(result) {
            //             var examinationModel = {
            //                 requestValidator: 'REQUEST-FROM-GRADE',
            //                 gradeId: $scope.grade.id,
            //                 type: options['type'],
            //             }
            //
            //             ExaminationService.post(examinationModel).then(function(response){
            //                 $state.go('examinationDetail',{id:response.data.id});
            //             },function(rejection){
            //
            //             })
            //         },
            //
            //         function() {
            //             // Cancel
            //         });
            // }

            $scope.gradeDetail.UI.click.sendNotificationDialog = function(ev, options){
                // Demo :: https://material.angularjs.org/latest/demo/dialog
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.prompt()
                    .title("Send Message / Notice")
                    .textContent("Send message to all users of this class")
                    .placeholder('type message here...')
                    .ariaLabel('Message')
                    // .initialValue('Buddy')
                    .targetEvent(ev)
                    .ok('Ok')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(
                    function(result) {
                        // var rec = $scope.grade.users.map(
                        //     function(user){
                        //         return (user['id'] || null) ;
                        //     }
                        // );
                        var msg = {};
                        // msg.recipients = rec;
                        msg.message = result;
                        msg.gradeId = $scope.grade.id;
                        msg.subject = msg.message.slice(0,20) + (msg.message.length > 20 ? '...' : ''); // Add .. only if message is greater than 20
                        ProductMsgService.post(msg).then(function(response){
                            if(response.status == 200){
                                ToastService.showSuccessMessageToast('Message');
                            }
                            else {
                                ToastService.showErrorMessageToast('Message');
                            }
                        });
                    },
                    function() {
                        // Cancel
                    }
                );
            }


            $scope.gradeDetail.UI.click.showScheduleFormDialog = function(ev,options) {
                $mdDialog.show({
                    // controller: function($scope){
                    //
                    // },
                    templateUrl: 'partial/schedule-form?scheduleType=routine&forEntity=grade&forEntityId='+$scope.grade.id,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    .then(function(answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

            this.loadGrade = function() {
                GradeService.get({id: $scope.stateParams.id})
                    .then(function (response) {
                        $scope.grade = response.data;
                        console.log($scope.grade);
                    });
            }
            this.loadGrade();
            $scope.gradeDetail.UI.click.showFileUpload = function(ev,options) {
                $mdDialog.show({
                    controller: function($scope){

                    },
                    templateUrl: 'partial/file-upload?forEntity=grade&forEntityId='+$scope.grade.id,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            };



        }]);




})();

app.controller('GradeDeleteController', function ($scope, $stateParams, $state, $location, GradeService, ToastService) {
    var stateParams = $stateParams;
    $scope.loadGrade = function () {
        GradeService.get({id:stateParams.id}).then(function(response) {
            $scope.grade = response.data;
        });
    }

    $scope.deleteGrade = function (param) {
        if(confirm('Are you sure ?')){
            GradeService.delete(param.id).then(function(response) {
                if(response.status == 200){
                    ToastService.showDeleteToast('Grade');
                    $location.path('/classes.html');
                }
                else {
                    ToastService.showErrorDeleteToast('Grade');

                }



            });
        }
    }

    $scope.cancel = function(){
        $state.go('gradeDetail',{id:stateParams.id});
    }

    $scope.loadGrade();
});


app.controller('GradeDiscussionController', function ($scope,$stateParams, ProductMsgService, GradeService) {
    $scope.threads = []; // [] -> changed to [].  [] is array and {} is object!!!
    $scope.grade = [];
    $scope.loadAll = function(){
        var options = {gradeId: $stateParams.id};

        ProductMsgService.query(options).then(function(response) {
            $scope.threads = response.data;
            console.log($scope.threads);
        });

        GradeService.get({id: $stateParams.id})
            .then(function (response) {
                $scope.grade = response.data;
                // console.log($scope.grade);
            });

    }

    $scope.loadAll();
});

/* for examination*/
app.controller('GradeExaminationController', function ($scope, $stateParams, $mdDialog, GradeService, ExaminationService, ToastService) {
    $scope.examinations = [];
    $scope.grade = [];

    $scope.createGradeExamination = function (options) {
        var data = {
            type : options['type'],
            gradeId: $scope.grade.id,
        };
        ExaminationService.post(data).then(function(response){
            alert('Examination successfully added in the system.'+'\n'+'Check console.log for response.');
        });
    }


    $scope.myParentExamId = undefined;

    $scope.showChildExams = function(id) {
        if($scope.myParentExamId) {
            $scope.myParentExamId = undefined;
        }
        else {
            $scope.myParentExamId = id;
        }
    }

    $scope.examinationListCardDelete = function (param, event) {
        var textContent = "";
        if(param.type == 'mainExam') {
            textContent += "Child Exams will be deleted permanently.";
        }
        else {
            textContent += "Record will be deleted permanently.";
        }
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete this examination?')
            .textContent(textContent)
            .targetEvent(event)
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            ExaminationService.delete(param.id).then(function (response) {
                if(response.status == 200){
                    ToastService.showDeleteToast('Examination');
                    location.reload();
                }
                else {
                    ToastService.showErrorDeleteToast('Examination');
                }

            })

        });
    }


    $scope.loadAll = function () {
        var options = {gradeId: $stateParams.id};

        ExaminationService.query(options).then(function (response) {
            $scope.examinations = response.data;
            console.log($scope.examinations);
        });

        GradeService.get({id: $stateParams.id})
            .then(function (response) {
                $scope.grade = response.data;
            });
    }
    $scope.loadAll();

});


app.controller('GradeScheduleController', function ($scope, $stateParams, GradeService, ScheduleService, ToastService) {


    $scope.stateParams = $stateParams;
    $scope.grade = [];
    $scope.schedule = [];
    $scope.loadAll = function () {


        GradeService.get({id: $scope.stateParams.id}).then(function (response) {
            $scope.grade = response.data;
            $scope.grade.courses= response.data.courses;
            console.log($scope.grade.courses);

        });
    }

    $scope.saveGradeSchedule = function () {
        // console.log($scope.grade.courses);
            ScheduleService.updateBulk($scope.grade.courses).then(function (response) {
                ToastService.showSuccessToast('Schedule');
                // // alert("bulkschedule updated successfully");
                // console.log(response);
            })
        }

        $scope.loadAll();
});

app.controller('GradeAttendanceController', function ($scope, $stateParams, GradeService) {
    $scope.data = {
        model: null,
        availableOptions: [
            {
                "id": 01,
                "month": "Baishak"
            },
            {
                "id": 02,
                "month": "Jestha"
            },
            {
                "id": 03,
                "month": "Asar"
            },
            {
                "id": 04,
                "month": "Shrawan"
            },
            {
                "id": 05,
                "month": "Bhadra"
            },
            {
                "id": 06,
                "month": "Ashwin"
            },
            {
                "id": 07,
                "month": "Kartik"
            },
            {
                "id": 08,
                "month": "Mangsir"
            },
            {
                "id": 09,
                "month": "Poush"
            },
            {
                "id": 10,
                "month": "Magh"
            },
            {
                "id": 11,
                "month": "Falgun"
            },
            {
                "id": 12,
                "month": "Chaitra"
            }
        ]
    };
    $scope.stateParams = $stateParams;
    $scope.grade = {};
    $scope.loadGrade = function () {
        GradeService.get({id: $scope.stateParams.id}).then(function (response) {
            $scope.grade = response.data;
            $scope.grade.users = response.data.users;
            // console.log($scope.grade);
        });

    }
    $scope.loadGrade();
});


(function () {
    app.directive('gradeDetailInfoCard', function() {

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                grade: '=grade'
            },

            templateUrl:  'partial/grade-detail-info-card',

            link: function(scope, elem, attrs) {
            },

            controller : ['$scope','PrintService', function ($scope,PrintService) {
                $scope.printCard=function(param){
                    PrintService.printGrade({id:param['id']});
                }
                
                
            }],

        };
    });

})();
app.factory('GradeRESTClient', function ($resource) {
    return $resource('api/grade/:id', {id: '@id',grade: '@grade'}, {
        'query': {method: 'GET', isArray: false },
        'update' : {method: 'PUT', params:{grade : '@grade'}, isArray: false},
        'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
    });
});
var GradeService = app.service('GradeService', function (GradeRESTClient) {

    var customParameters = {'ASSIGN_GRADE_TO_USER' : {'action' : 'assignGradeToUser'},
                            'REMOVE_ALL_GRADES_ASSIGNED_TO_USER' : {'action' : 'removeAllGradeUserData'},
                            'REMOVE_GRADE_ASSIGNED_TO_USER' : {'action' : 'removeGradeFromUser'},
                            };

    return {
        get: function(id) {
            return GradeRESTClient.get({id:id.id}).$promise;
        },

        post: function(grade){
            return GradeRESTClient.save(grade).$promise;
        },

        assignGradeToUser: function(gradeUser){
            gradeUser.customParameters = customParameters['ASSIGN_GRADE_TO_USER'];
            return GradeRESTClient.save(gradeUser).$promise;
        },

        removeGradeFromUser: function(gradeUser){
            gradeUser.customParameters = customParameters['REMOVE_GRADE_ASSIGNED_TO_USER'];
            return GradeRESTClient.update(gradeUser).$promise;
        },

        delete: function(id){
            return GradeRESTClient.delete({id:id}).$promise;
        },

        all: function(data){
            return GradeRESTClient.query(data).$promise;
        },

        update: function(grade){
            return GradeRESTClient.update(grade).$promise;
        }
    }
});
// register the interceptor as a service
app.factory('ProductAuthenticationInterceptor', function($q) {

    var loginURL = 'login';

    return {
        'request': function(config) {
            return config;
        },

        'response': function(response) {
            return response;
        },

        // optional method
        // 'requestError': function(rejection) {
        //     return $q.reject(rejection);
        // },

        // optional method
        'responseError': function(rejection) {
            if(rejection.status === 401){
                window.location.href = loginURL;
                return;
            }
            return $q.reject(rejection);
        }
    };
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('ProductAuthenticationInterceptor');
}]);
(function () {
    app.factory('DisplayErrorInDialogInterceptor', function($q) {

        return {
            'request': function(config) {
                return config;
            },

            'response': function(response) {
                if(response.data['info'] !== undefined && response.data['info'].length > 0 ){
                    alert(response.data['info']);
                }
                return response;
            },

            // optional method
            // 'requestError': function(rejection) {
            //     return $q.reject(rejection);
            // },

            // optional method
            'responseError': function(rejection) {
                return $q.reject(rejection);
            }
        };
    });

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('DisplayErrorInDialogInterceptor');
    }]);

})();
(function () {
app.factory('NotificationRequestInterceptor', function($q, $timeout) {
    return {
        'request': function(config) {
            if(config.url.startsWith('api/')){
                config.headers['Notification-Count-After']= new Date().getTime();
            }
            return config;
        },

        'response': function(response) {
            if(response.headers('Notification-Count')){
                if(response.headers('Notification-Count') > 0) {
                    document.getElementById("left-menu-notification-count").innerHTML = "<span class='top-notification'>"+response.headers('Notification-Count')+"</span>";
                    document.getElementById("left-menu-notification-count1").innerHTML = "<span class='mailbox-count'>"+response.headers('Notification-Count')+"</span>";
                }
                else {
                    document.getElementById("left-menu-notification-count").innerHTML = "";
                    document.getElementById("left-menu-notification-count1").innerHTML = "";
                }


            }
            return response;
        },

        // optional method
        // 'requestError': function(rejection) {
        //     return $q.reject(rejection);
        // },

        // optional method
        // 'responseError': function(rejection) {
        // }
    };
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('NotificationRequestInterceptor');
}]);

})();
(function () {
    app.factory('ProductXHREventInterceptor', function($q, $rootScope) {
        var isAPIRequest = function(url) {
            return url.startsWith("api/");
        }

        return {

            'request': function(config) {
                if(product_GLOBALS_isSQLDebugMode){
                    config.params = config.params || {};
                    config.params.sql_debug = true;
                }

                if(isAPIRequest(config.url)){
                    $rootScope.$broadcast('product.api.xhr.send',config);
                }

                return config;
            },

            'response': function(response) {
                if(isAPIRequest(response.config.url)){
                    if(response.data['error'] && Object.keys(response.data['error']).length > 0){
                        document.getElementById('top-error-display').innerHTML = JSON.stringify(response.data['error']);
                    }

                    $rootScope.$broadcast('product.api.xhr.receive',response);
                }
                return response;
            },

            // optional method
            // 'requestError': function(rejection) {
            //     return $q.reject(rejection);
            // },

            // optional method
            'responseError': function(rejection) {
                if(isAPIRequest(rejection.config.url)){
                    $rootScope.$broadcast('product.api.xhr.receive.error',rejection);
                }
                return $q.reject(rejection);
            }
        };
    });

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('ProductXHREventInterceptor');
    }]);

})();
app.controller('MarksFormController', function ($scope, $stateParams, MarksService) {
    $scope.mark = {};
    $scope.stateParams = $stateParams;

    $scope.getMarksModel = function(){
        var mark = {
            name:$scope.mark.name,
            userId:$scope.mark.userId,
            examId:$scope.mark.examId,
            remarks:$scope.mark.remarks,
            marksObtained:$scope.mark.marksObtained,
            gradeObtained:$scope.mark.gradeObtained,
            answer:$scope.mark.answer,
            passOrFail:$scope.mark.passOrFail,


        }

        if($scope.mark.id){
            mark['id'] = $scope.mark.id;
        }
        return mark;
    }


    $scope.signUp = function () {
        MarksService.post($scope.getMarksModel()).then(function(response){
            alert('Marks successfully added in the system.'+'\n'+'Check console.log for response.');
        });
    }


    $scope.createMarks = function () {
        MarksService.post($scope.getMarksModel()).then(function(response){
            alert('Marks successfully added in the system.'+'\n'+'Check console.log for response.');
        });
    }


    // EDIT Section //
    $scope.loadMarksForEdit = function () {
        MarksService.get({id:$scope.stateParams.id}).then(function(response){
            $scope.mark = response.data;
        });
    }

    $scope.editState = false;
    if($scope.stateParams.actionParams.action === 'edit'){
        $scope.editState = true;
        $scope.loadMarksForEdit();
    }

    $scope.edit = function(){
        console.log('called');
        console.log($scope.getMarksModel());
        MarksService.update($scope.getMarksModel()).then(function (response) {
            console.log('response');
        });
    }
});

(function () {
app.controller('MarksListCardsController', ['$scope','$controller', 'MarksService', function ($scope, $controller, MarksService) {
    angular.extend(this, $controller('FilterDBStoreController', {$scope: $scope}));
    $scope.loadAll = function () {
        var allDisplayIDs = $scope.mainFilter.getListOfEntityIDsToShow();
        if(allDisplayIDs !== undefined && allDisplayIDs.length > 0){
            var multipleIDSearch = {findByIds: allDisplayIDs.join(',')};
            MarksService.all(multipleIDSearch).then(
                function (response) {
                    $scope.marks = response.data;
                });
        }
    }

    $scope.saveMarks = function (currentData) {
       MarksService.update(currentData).then(function (response) {
            alert("marks added successfully");
        })
    }
//     $scope.marks;
//
//     $scope.gridOptions = { data: 'marks',
//         columnDefs:
//             [{field: 'id', displayName: 'ID', width: 50 },
//                 {field: 'name', displayName: 'Name'  },
//                 {field: 'remarks', displayName: 'Remarks'  },
//             ],
//         enableRowSelection: true,
//         enableSelectAll: true,
//         enableSorting: false,
//         selectionRowHeaderWidth: 35,
//         enableHorizontalScrollbar: 1,
//         enableColumnResizing: true,
//
//     };
//
//     $scope.loadAll = function(){
//         MarksService.all().then(function(response) {
//             $scope.marks = response.data;
//         });
//     }
//
//     $scope.deleteMarks = function (id) {
//         MarksService.delete(id).then(function(response) {
//             $scope.loadAll();
//         });
//     }
//
//
//     $scope.loadAll();
//
// });
}]);
})();

app.controller('MarkProfileController', function ($scope, $stateParams, MarksService) {
    $scope.stateParams = $stateParams;
    $scope.mark = {};

    $scope.loadMarks = function () {
        MarksService.get({id:$scope.stateParams.id}).then(function(response) {
            $scope.mark = response.data;
        });
    }
    $scope.loadMarks();
});

app.controller('ExaminationMarksController', function ($scope, $stateParams, MarksService, $location, ToastService) {
    $scope.stateParams = $stateParams;
    $scope.examinationUsers = {};

    $scope.loadExaminationUsers = function () {
        var data = {
            examinationId: $scope.stateParams.id,
        }
        MarksService.query(data).then(function(response) {
            $scope.examinationUsers = response.data;
            console.log($scope.examinationUsers);
        });
    }

    // $scope.saveMarks = function (currentIndex) {
    //     MarksService.update($scope.examinationUsers[currentIndex]).then(function (response) {
    //         alert("marks added successfully");
    //     })
    // }

    $scope.saveBulkMarks = function () {
        MarksService.updateBulk($scope.examinationUsers).then(function (response) {
            if(response.status == 200){
                ToastService.showSuccessToast('Marks');
                $location.path('/examination/all');
            }
            else {
                ToastService.showErrorToast('Marks');
            }        })

    }
    $scope.loadExaminationUsers();
});


(function () {
app.factory('MarksRESTClient', function ($resource) {
    return $resource('api/marks/:id', {id: '@id'}, {
        'query': {method: 'GET', isArray: false },
        'update' : {method: 'PUT', params:{mark : '@mark'}, isArray: false},
    });
});
})();

(function () {
app.factory('MarksBulkRESTClient', function ($resource) {
	return $resource('api/updateBulkMarks', {}, {
		'update' : {method: 'PUT', params:{mark : '@mark'}, isArray: false},
	});
});
})();
var MarksService = app.service('MarksService', function (MarksRESTClient, MarksBulkRESTClient) {
    return {
        get: function(id) {
            return MarksRESTClient.get({id:id.id}).$promise;
        },

        getEdit:function(id){
            return MarksRESTClient.getEdit({id:id.id})
        },

        post: function(marks){
            return MarksRESTClient.save(marks).$promise;
        },

        all: function(){
            return MarksRESTClient.query().$promise;
        },

        query: function(options){
            return MarksRESTClient.query(options).$promise;
        },

        update: function(mark){
            return MarksRESTClient.update(mark).$promise;
        },

        updateBulk: function(mark){
            return MarksBulkRESTClient.update(mark).$promise;
        },

        delete: function(id){
            return MarksRESTClient.delete({id:id}).$promise;
        },

        edit: function(marks){
            return MarksRESTClient.edit(marks)
        }
    }
});
app.controller('MessageFormController', function ($scope, $stateParams, ProductMsgService, UserService, $location, $mdToast, ToastService, $mdDialog) {

    $scope.message = {};
    $scope.users = {};
    $scope.stateParams = $stateParams;
    $scope.querySearch = querySearch;
    $scope.allUsers = {};
    $scope.user = {};
    $scope.filterSelected = true;

    $scope.createMessage = function(){
        var users = $scope.user;
        var recipients = $scope.pluckRecipientIds(users);

        console.log(recipients.length);
        var message = {
            subject:$scope.message.subject,
            message:$scope.message.message,
            recipients:recipients,
        }
        console.log(message);
        if(recipients.length == 0) {
            alert('choose at least one reciepients');
        }
        else {
            ProductMsgService.post(message).then(function(response){
                if(response.status == 200){
                    ToastService.showSuccessMessageToast('Message');
                    $mdDialog.hide();
                    location.reload();
                }
                else {
                    ToastService.showErrorMessageToast('Message');
                }
            });
        }

    }

    $scope.cancelMessage = function(){
        $mdDialog.hide();
    }


    function querySearch (userId) {
        var results = userId ?
            $scope.allUsers.filter(createFilterFor(userId)) : [];
        return results;

    }

    // Create filter function for a query string
    function createFilterFor(query) {
        var finalQuery = query.toLowerCase();
        return function filterFn(user) {
            user.lowerCaseName = user.fullName.toLowerCase();
            return (user.lowerCaseName.indexOf(finalQuery) != -1);
        };
    }

    $scope.loadAllUsers = function() {
            UserService.all().then(function(response){
                $scope.users = response.data;
                $scope.allUsers = $scope.users;
                $scope.user = [];
                console.log('user'+response);
            });



    }

    $scope.pluckRecipientIds = function (users) {
        var recipients = [];
        users.forEach(function (user) {
            recipients.push(user.id);
        })
        return recipients;
    }

    $scope.getMessageModel = function(){
        var message = {
            subject:$scope.message.subject,
            message:$scope.message.message,
            recipients:$scope.message.recipients,
        }

        if($scope.message.id){
            message['id'] = $scope.message.id;

        }
        return message;
    }

    $scope.loadAllUsers();

});

app.controller('MessageListCardsController', function ($scope, ProductMsgService, $mdDialog) {
    $scope.threads = {};

    $scope.loadAll = function(){
        ProductMsgService.all().then(function(response) {
            $scope.threads = response.data;
            console.log($scope.threads);

        });
    }

    $scope.loadMessageForm = function (ev) {
        $mdDialog.show({
            templateUrl: 'partial/message-form',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.loadAll();
});

app.controller('MessageProfileController', function ($scope, $stateParams, ProductMsgService) {
    $scope.stateParams = $stateParams;
    $scope.messages = {};
    $scope.message = {};

    // You can still access the trix event
    // var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur', 'trixFileAccept', 'trixAttachmentAdd', 'trixAttachmentRemove'];
    //
    // for (var i = 0; i < events.length; i++) {
    //     $scope[events[i]] = function(e, editor) {
    //         console.info('Event type:', e.type);
    //     }
    // };

    $scope.loadMessages = function () {
        ProductMsgService.get({id:$scope.stateParams.id}).then(function(response) {
            $scope.messages = response.data;
            console.log($scope.messages);
        });
    }

    $scope.getSingleMessageModel = function() {
        var message = {
            id:$scope.stateParams.id,
            inputMessage:$scope.message.inputMessage,
        }
        return message;
    }

    $scope.updateMessage = function () {
        ProductMsgService.update($scope.getSingleMessageModel()).then(function(response) {
            $scope.loadMessages();
            $scope.message.inputMessage = "";
        });
    }

    $scope.loadMessages();
});

app.factory('ProductMsgRESTClient', function ($resource) {
    return $resource('api/message/:id', {id: '@id', message: '@message'}, {
        'query': {method: 'GET', isArray: false },
        'update' : {method: 'PUT', params:{message : '@message'}, isArray: false},
        'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
    });
});
var ProductMsgService = app.service('ProductMsgService', function (ProductMsgRESTClient) {
    return {
        query: function(options){
            return ProductMsgRESTClient.query(options).$promise;
        },

        get: function(id) {
            return ProductMsgRESTClient.get({id:id.id}).$promise;
        },

        post: function(message){
            return ProductMsgRESTClient.save(message).$promise;
        },

        delete: function(id){
            return ProductMsgRESTClient.delete({id:id}).$promise;
        },

        all: function(){
            return ProductMsgRESTClient.query().$promise;
        },

        update: function(message){
            return ProductMsgRESTClient.update(message).$promise;
        }
    }
});
// notice related controller
app.controller('NoticeFormController', ['$scope', 'RoleService', 'NoticeService', '$stateParams', '$location', 'ToastService', '$mdDialog',
    function ($scope, RoleService, NoticeService, $stateParams, $location, ToastService, $mdDialog) {
        $scope.roles = {};
        $scope.stateParams = $stateParams;
        $scope.notice = {};
        $scope.selectedRole = undefined;
        $scope.selectAllClicked = false;
        $scope.displaySelectData = "Select All";

        $scope.loadRoles = function() {
                RoleService.all().then(function (response) {
                        $scope.roles = response.data;
                });
        }

        $scope.createNotice = function () {
                // format
                var data = {
                roleId: $scope.notice.roleId,
                notice: $scope.notice.notice,
                }

                NoticeService.post(data).then(function(response){
                if(response.status == 200){
                    ToastService.showSuccessToast('Notice');
                    $mdDialog.hide();
                    location.reload();

                }
                else {
                    ToastService.showErrorToast('Notice');
                }

            });
        }


        $scope.noticeDelete = function (param, event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this notice?')
                .textContent('Notice will be deleted permanently.')
                .targetEvent(event)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                NoticeService.delete(param.id).then(function (response) {
                    if(response.status == 200){
                        ToastService.showDeleteToast('Notice');
                        location.reload();
                    }
                    else {
                        ToastService.showErrorDeleteToast('Notice');
                    }

                })

            });
        };

        $scope.noticeEdit = function (noticeId, ev) {
            console.log(noticeId);

            $mdDialog.show({          
                targetEvent: ev,
                clickOutsideToClose:true,
                templateUrl: 'partial/notice-form',
                locals: {
                    noticeId: noticeId,
                    editState: true
                },
                controller: ['$scope', 'noticeId', 'editState', function($scope, noticeId, editState) {
                // share data to control being used by partial/user-form
                $scope.noticeId = noticeId;
                $scope.editState = editState
            }]
            })
                .then(function(answer) {

                }, function() {

                });
        }


        $scope.cancelNotice = function(){
            $mdDialog.hide();

        }

        // EDIT Section //
        $scope.loadNoticeForEdit = function () {
            // console.log('edi notice'+$scope.stateParams.id);
            NoticeService.get({id:$scope.noticeId}).then(function(response){
                $scope.notice = response.data;
                // $scope.roleId = response.data.roleId;
                console.log(response.data);
            });
        }

        //load notice if editstate true
        if ($scope.editState == true) {
            console.log('here');
            $scope.loadNoticeForEdit();
        }

        // $scope.editState = false;
        // if($scope.stateParams.actionParams.action === 'edit'){
        //     $scope.editState = true;
        //     $scope.loadNoticeForEdit();
        // }
        $scope.edit = function(){
            var data = {
                id: $scope.notice.id,
                roleId: $scope.notice.roleId,
                notice: $scope.notice.notice,
            }
            // console.log(data);
            NoticeService.update(data).then(function (response) {
                if(response.status == 200){
                    ToastService.showUpdateToast('Notice');
                    $mdDialog.hide();
                    location.reload();
                }
                else {
                    ToastService.showErrorUpdateToast('Notice');
                }

            });
        }

        $scope.cancel = function(){
            $mdDialog.hide();
        }

        $scope.selectAll = function () {

            var selectedRoleIds = [];

            if(!$scope.selectAllClicked){
                //if clicked first time
                $scope.selectAllClicked = true;
                $scope.displaySelectData = "Unselect All";
                $scope.roles.forEach(function (role) {
                    selectedRoleIds.push(role.id);
                })
            } else {
                $scope.selectAllClicked = false;
                $scope.displaySelectData = "Select All";

                selectedRoleIds = [];
            }

            $scope.notice.roleId = selectedRoleIds;

            console.log(selectedRoleIds);
        }



        $scope.loadRoles();

}]);
(function () {
    app.factory('NoticeRESTClient', ['$resource', function ($resource) {
        return $resource('api/notice/:id', {id: '@id', notice: '@notice'}, {
            'query': {method: 'GET', isArray: false },
            'update' : {method: 'PUT', params:{notice : '@notice'}, isArray: false},
            'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
        });
    }]);
})();
var NoticeService = app.service('NoticeService', ['NoticeRESTClient', function (NoticeRESTClient) {
    return {
        get: function(id) {
            return NoticeRESTClient.get({id:id.id}).$promise;
        },

        post: function(notice){
            return NoticeRESTClient.save(notice).$promise;
        },

        all: function(){
            return NoticeRESTClient.query().$promise;
        },

        query: function(options){
            return NoticeRESTClient.query(options).$promise;
        },

        update: function(notice){
            return NoticeRESTClient.update(notice).$promise;
        },

        delete: function(id){
            return NoticeRESTClient.delete({id:id}).$promise;
        },

        edit: function(notice){
            return NoticeRESTClient.edit(notice)
        }
    }
}]);
(function () {

    app.factory('PrintURLFactory', function () {
        return {
            user: function (param) {
                return 'api/print/user/' + param['id']
            },
            examination: function (param) {
                return 'api/print/examination/' + param['id']
            },
            course: function (param) {
                return 'api/print/course/' + param['id']
            },
            grade: function (param) {
                return 'api/print/grade/' + param['id']
            },
            transaction: function (param) {
                return 'api/print/transaction/' + param['id']
            }

        }
    });

})();

(function () {
    app.service('PrintService', function (PrintURLFactory) {
    return{
        print: function(url){
            var printWindow = window.open( url, 'Print', 'left=200, top=200, width=950, height=500, toolbar=0, resizable=0');
            printWindow.addEventListener('load', function(){
                printWindow.print();
            }, true);
        },

        printUser: function(param){
            return this.print(PrintURLFactory.user({id: param['id']}))
        },

        printGrade: function(param){
            return this.print(PrintURLFactory.grade({id: param['id']}))
        },

        printExamination: function(param){
            return this.print(PrintURLFactory.examination({id: param['id']}))
        },

        printCourse: function(param){
            return this.print(PrintURLFactory.course({id: param['id']}))
        },

        printTransaction: function (param) {
            return this.print(PrintURLFactory.transaction({id: param['id']}))
        }
    }
    });
})();

(function () {
    app.service('PrintService', function (PrintURLFactory) {
        return {
            print: function (url) {
                var printWindow = window.open(url, 'Print', 'left=200, top=200, width=950, height=500, toolbar=0, resizable=0');
                printWindow.addEventListener('load', function () {
                    printWindow.print();
                }, true);
            },

            printUser: function (param) {
                return this.print(PrintURLFactory.user({id: param['id']}))
            },

            printGrade: function (param) {
                return this.print(PrintURLFactory.grade({id: param['id']}))
            },
            printExamination: function (param) {
                return this.print(PrintURLFactory.examination({id: param['id']}))
            },

            printCourse: function (param) {
                return this.print(PrintURLFactory.course({id: param['id']}))
            },

            printTransaction: function (param) {
                return this.print(PrintURLFactory.transaction({id: param['id']}))
            }
        }
    });
})();

/**
 * Created by sadhikari on 8/19/2016.
 */

app.controller('RoleFormController', function ($scope, ToastService, $stateParams, RoleService, $location, $state, $mdDialog) {

    $scope.role = {};
    $scope.role.name;
    $scope.role.displayName;
    $scope.role.description;
    $scope.stateParams = $stateParams;
    var stateParams = $stateParams;


    $scope.createRole = function(){
        RoleService.post($scope.getRoleModel()).then(function(response){
            if(response.status == 200){
                ToastService.showSuccessToast('Role');
                $mdDialog.hide();
                location.reload();
            }
            else {
                ToastService.showErrorToast('Role');
            }
        });
    }

    $scope.cancelRole = function(){
        $mdDialog.hide();
        // $location.path('/roles.html');
        // location.reload();
    }

    $scope.getRoleModel = function(){
        var role = {
            name:$scope.role.name,
            display_name:$scope.role.displayName,
            description:$scope.role.description,
        }

        if($scope.role.id){
            role['id'] = $scope.role.id;
        }
        return role;
    }

    

    // EDIT Section //
    $scope.loadRoleForEdit = function () {
        console.log('roleId'+$scope.roleId);
        RoleService.get({id:$scope.roleId}).then(function(response){
            $scope.role = response.data;
            console.log($scope.role);
        });
    }

    if ($scope.editState == true) {
        //came from role-dialog
        $scope.loadRoleForEdit();
    }

    // $scope.editState = false;
    // if($scope.stateParams.actionParams.action === 'edit'){
    //     $scope.editState = true;
    //     $scope.loadRoleForEdit();
    // }

    $scope.edit = function(){
        RoleService.update($scope.getRoleModel()).then(function (response) {
            if(response.status == 200) {
                ToastService.showUpdateToast('Role');
                $mdDialog.hide();
                location.reload();
                // $state.go('roleDetail', {id: stateParams.id});
            }
            else {
                    ToastService.showErrorUpdateToast('Role');
                }
        });
    }

    $scope.cancel = function(){
        $mdDialog.hide();
    }

});


app.controller('RoleUserFormController', function ($scope, $stateParams, RoleService, UserService, $state) {
    $scope.roles = {};
    $scope.user = {};
    $scope.roleUser = {};
    $scope.stateParams = $stateParams;

    $scope.loadUser = function(id){
        UserService.get(id).then(function(response){
            $scope.user = response.data;
        });
    };

    $scope.loadAllRoles = function(){
        RoleService.all().then(function(response){
            $scope.roles = response.data
        });
    }

    $scope.getRoleUserModel = function(){
        var roleUser = {
            userId:$scope.user.id,
            roleId: $scope.roleUser.roleId,
        }
        return roleUser;
    }

    $scope.assignRoleToUser = function () {
        console.log($scope.getRoleUserModel());
        RoleService.assignRoleToUser($scope.getRoleUserModel()).then(function(response){
            alert('Successfully added in the system.'+'\n'+'Check console.log for response.');
        });
    }

    $scope.loadAllRoles();
    $scope.loadUser({id:$scope.stateParams.id});

});

app.controller('RoleListCardsController', function ($scope, RoleService, $mdDialog, $stateParams, ToastService){

    $scope.roles={};

    $scope.stateParams = $stateParams;

    $scope.roleListDelete = function (param, event) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete this role?')
            .textContent('Record will be deleted permanently.')
            .targetEvent(event)
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            RoleService.delete(param.id).then(function (response) {
                if(response.status == 200){
                    $scope.roles.splice(param.index);
                    ToastService.showDeleteToast('Role');
                    // location.reload();
                }
                else {
                    ToastService.showErrorDeleteToast('Role');
                }

            })

        });
    };

    $scope.loadAll = function(){
        RoleService.all().then(function(response) {
            $scope.roles = response.data;
            console.log($scope.roles);
        });
    }

    $scope.deleteRole = function (id) {
        //confirm deletion from user
        // alert("deleting");
        $confirm = confirm("Are you sure to delete the role?");
        if ($confirm) {
            RoleService.delete(id).then(function(response) {
                $scope.loadAll();
            });

        }

    }

    $scope.roleEdit = function (roleId, ev) {
        $mdDialog.show({
            targetEvent: ev,
             templateUrl: 'partial/role-form',
             clickOutsideToClose: true,
             locals: {
               roleId: roleId,
               editState: true
             },
             controller: ['$scope', 'roleId', 'editState', function($scope, roleId, editState) { 
                // share data to controll being used by partial/role-form
                $scope.roleId = roleId;
                $scope.editState = editState
            }]
        });
    }


    //pop up create role form
    $scope.loadRoleForm = function (ev) {
        $mdDialog.show({
            templateUrl: 'partial/role-form',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.loadAll();

});

app.controller('RoleProfileController', function ($scope, RoleService, UserService, $mdDialog, $stateParams, ToastService) {
    $scope.stateParams = $stateParams;
    $scope.role = {};

    $scope.loadAll = function () {
        RoleService.get({id:$scope.stateParams.id}).then(function(response) {
            $scope.role = response.data;
            console.log($scope.role);
        });
    }
    $scope.loadAll();

    $scope.stateParams = $stateParams;

    $scope.roleUserDetailDelete = function (param, event) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete this user?')
            .textContent('Record will be deleted permanently.')
            .targetEvent(event)
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            UserService.delete(param.id).then(function (response) {
                if(response.status == 200){
                    ToastService.showDeleteToast('User');
                    location.reload();
                }
                else {
                    ToastService.showErrorDeleteToast('User');
                }

            })

        });
    };


    // EDIT Section //
    $scope.loadUserForEdit = function () {
        console.log('userId'+$scope.userId);
        UserService.get({id:$scope.userId}).then(function(response){
            $scope.user = response.data;
            console.log($scope.user);
        });
    }


    if ($scope.editState == true) {
        $scope.loadUserForEdit();
    }


    //user pop-up edit form
    $scope.userEdit = function (userId, ev) {
        $mdDialog.show({
            targetEvent: ev,
            templateUrl: 'partial/user-form',
            clickOutsideToClose: false,
            locals: {
                userId: userId,
                editState: true
            },
            controller: ['$scope', 'userId', 'editState', function($scope, userId, editState) {
                // share data to control being used by partial/user-form
                $scope.userId = userId;
                $scope.editState = editState
            }]
        });
    }
});

app.controller('RoleDeleteController', function ($scope, $stateParams, $state, $location, RoleService, ToastService) {
    var stateParams = $stateParams;
    $scope.loadRole = function () {
        RoleService.get({id:stateParams.id}).then(function(response) {
            $scope.role = response.data;
            console.log($scope.role);
        });
    }

    $scope.deleteRole = function (param) {
        if(confirm('Are you sure ?')){
            RoleService.delete(param.id).then(function(response) {
                if(response.status == 200){
                    ToastService.showDeleteToast('Role');
                $location.path('/roles.html');
                }
                else {
                    ToastService.showErrorDeleteToast('Role');
                }
            });
        }
    }

    $scope.cancel = function(){
        $state.go('roleListCard');
    }

    $scope.loadRole();
});
app.controller('RolePermissionController', function ($scope, $controller, $stateParams, RoleService) {
    $scope.stateParams = $stateParams;
    $scope.role = {};
    $scope.data = 1;
    $scope.checkbox = {
     };
    $scope.filteredPermissions = {};


    //filters the permissions entity-wise..
    $scope.filterPermissions = function (permissions) {
        $scope.filteredPermissions['user'] = permissions.filter(function(permission) {
            return permission.name.includes('user');
        });
        $scope.filteredPermissions['room'] = permissions.filter(function(permission) {
            return permission.name.includes('room');
        });
        $scope.filteredPermissions['course'] = permissions.filter(function(permission) {
            return permission.name.includes('course');
        });
        $scope.filteredPermissions['grade'] = permissions.filter(function(permission) {
            return permission.name.includes('grade');
        });
        $scope.filteredPermissions['role'] = permissions.filter(function(permission) {
            return permission.name.includes('role');
        });
        $scope.filteredPermissions['address'] = permissions.filter(function(permission) {
            return permission.name.includes('address');
        });
        $scope.filteredPermissions['permission'] = permissions.filter(function(permission) {
            return permission.name.includes('permission');
        });
        $scope.filteredPermissions['examination'] = permissions.filter(function(permission) {
            return permission.name.includes('examination');
        });
        $scope.filteredPermissions['marks'] = permissions.filter(function(permission) {
            return permission.name.includes('marks');
        });
        $scope.filteredPermissions['attendance'] = permissions.filter(function(permission) {
            return permission.name.includes('attendance');
        });
        $scope.filteredPermissions['schedule'] = permissions.filter(function(permission) {
            return permission.name.includes('schedule');
        });
        $scope.filteredPermissions['message'] = permissions.filter(function(permission) {
            return permission.name.includes('message');
        });
        $scope.filteredPermissions['file'] = permissions.filter(function(permission) {
            return permission.name.includes('file');
        });
        $scope.filteredPermissions['notice'] = permissions.filter(function(permission) {
            return permission.name.includes('notice');
        });

    }

    $scope.loadAll = function () {
        RoleService.get({id:$scope.stateParams.id}).then(function(response) {
            $scope.role=response.data;
            $scope.permissions = response.data.permissionList;
            // $scope.permission_role = response.data.users.rolePermission;

            $scope.filterPermissions($scope.permissions);//filter data
        });
    }

    
    $scope.loadAll();
});


(function () {
    app.directive('roleDetailInfoCard', function() {

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                role: '=role'
            },

            templateUrl:  'partial/role-detail-info-card',

            link: function(scope, elem, attrs) {
            },

            controller : ['$scope', function ($scope) {
            }],

        };
    });

})();
/**
 * Created by sadhikari on 8/19/2016.
 */
app.factory('RoleRESTClient', function ($resource) {
    return $resource('api/role/:id', {id: '@id',grade: '@role'}, {
        'query': {method: 'GET', isArray: false },
        'update' : {method: 'PUT', params:{grade : '@role'}, isArray: false},
        'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
    });
});
/**
 * Created by sadhikari on 8/19/2016.
 */
var RoleService = app.service('RoleService', function (RoleRESTClient) {
    var customParameters = {'ASSIGN_ROLE_TO_USER' : {'action' : 'assignRoleToUser'},
                            'REMOVE_ALL_ROLES_ASSIGNED_TO_USER' : {'action' : 'removeAllRoleUserData'},
                            };

    return {
        get: function(id) {
            return RoleRESTClient.get({id:id.id}).$promise;
        },

        post: function(role){
            return RoleRESTClient.save(role).$promise;
        },

        assignRoleToUser: function(roleUser){

            roleUser.customParameters = customParameters['ASSIGN_ROLE_TO_USER'];
            return RoleRESTClient.save(roleUser).$promise;
        },

        delete: function(id){
            return RoleRESTClient.delete({id:id}).$promise;
        },

        all: function(){
            return RoleRESTClient.query().$promise;
        },

        update: function(role){
            return RoleRESTClient.update(role).$promise;
        }

    }
});
app.controller('RoomFormController', function ($scope, $stateParams, RoomService) {
    $scope.room = {};
    $scope.stateParams = $stateParams;

    $scope.getRoomModel = function(){
        var room = {
            name:$scope.room.name,
            building:$scope.room.building,
            room:$scope.room.room,
            floor:$scope.room.floor,

        }

        if($scope.room.id){
            room['id'] = $scope.room.id;
        }
        return room;
    }


    $scope.createRoom = function () {

        RoomService.post($scope.getRoomModel()).then(function(response){
            alert('Room successfully added in the system.'+'\n'+'Check console.log for response.');
        });
    }


    // EDIT Section //
    $scope.loadRoomForEdit = function () {
        RoomService.get({id:$scope.stateParams.id}).then(function(response){
            $scope.room = response.data;
        });
    }

    $scope.editState = false;
    if($scope.stateParams.actionParams.action === 'edit'){
        $scope.editState = true;
        $scope.loadRoomForEdit();
    }

    $scope.edit = function(){
        RoomService.update($scope.getRoomModel()).then(function (response) {
            alert('Room Updated.');
        });
    }
});

app.controller('RoomListCardsController', function ($scope, RoomService) {

    $scope.rooms;


    $scope.gridOptions = { data: 'rooms',

        columnDefs:
            [
                {field: 'id', displayName: 'ID', width: 50 },
                {field: 'name', displayName: 'Name', width: 300  },
                {field: 'building', displayName: 'Building ID', width: 150  },
                {field: 'room', displayName: 'Room ID', width: 150  },
                {field: 'floor', displayName: 'Floor ID', width: 150  },
            ],
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
    };

    $scope.loadAll = function(){
        RoomService.all().then(function(response) {
            $scope.rooms = response.data;
        });
    }

    $scope.deleteRoom = function (id) {
        RoomService.delete(id).then(function(response) {
            $scope.loadAll();
        });
    }


    $scope.loadAll();

});

app.controller('RoomProfileController', function ($scope, $stateParams, RoomService) {
    $scope.stateParams = $stateParams;
    $scope.room = {};

    $scope.loadRooms = function () {
        RoomService.get({id:$scope.stateParams.id}).then(function(response) {
            $scope.room = response.data;
        });
    }
    $scope.loadRooms();
});
app.factory('RoomRESTClient', function ($resource) {
     return $resource('api/room/:id', {id: '@id',room: '@room'}, {
          'query': {method: 'GET', isArray: false },
          'update' : {method: 'PUT', params:{room : '@room'}, isArray: false},
          'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
     });
});
var RoomService = app.service('RoomService', function (RoomRESTClient) {
    return {
        get: function(id) {
            return RoomRESTClient.get({id:id.id}).$promise;
        },

        post: function(room){
            return RoomRESTClient.save(room).$promise;
        },

        delete: function(id){
            return RoomRESTClient.delete({id:id}).$promise;
        },

        all: function(){
            return RoomRESTClient.query().$promise;
        },

        update: function(room){
            return RoomRESTClient.update(room).$promise;
        }
    }
});
app.controller('ScheduleFormController', function ($scope, $state, $stateParams, ScheduleService, ToastService, $mdDialog, $location, CourseService) {
    $scope.schedule = {};
    $scope.stateParams = $stateParams;
    var stateParams = $stateParams;
    $scope.course={};

    $scope.getScheduleModel = function(){
        var schedule = {
            name:$scope.schedule.name,
            type:$scope.schedule.type,
            from:$scope.schedule.from,
            to:$scope.schedule.to,
            exceptDateTimeCSV:$scope.schedule.exceptDateTimeCSV,
            forEntity: $scope.schedule.forEntity,
            forEntityId: $scope.stateParams.id, //input from form instead
            sun:$scope.schedule.sun,
            mon:$scope.schedule.mon,
            tue:$scope.schedule.tue,
            wed:$scope.schedule.wed,
            thu:$scope.schedule.thu,
            fri:$scope.schedule.fri,
            sat:$scope.schedule.sat,
            sunFrom:$scope.schedule.sunFrom,
            sunTo:$scope.schedule.sunTo,
            monFrom:$scope.schedule.monFrom,
            monTo:$scope.schedule.monTo,
            tueFrom:$scope.schedule.tueFrom,
            tueTo:$scope.schedule.tueTo,
            wedFrom:$scope.schedule.wedFrom,
            wedTo:$scope.schedule.wedTo,
            thuFrom:$scope.schedule.thuFrom,
            thuTo:$scope.schedule.thuTo,
            friFrom:$scope.schedule.friFrom,
            friTo:$scope.schedule.friTo,
            satFrom:$scope.schedule.satFrom,
            satTo:$scope.schedule.satTo,
        }

        if($scope.schedule.id){
            schedule['id'] = $scope.schedule.id;
        }

        return schedule;
    }

    //hide or show containers for input times(from & to)
    $scope.sunValue = false;
    $scope.monValue = false;
    $scope.tueValue = false;
    $scope.wedValue = false;
    $scope.thuValue = false;
    $scope.friValue = false;
    $scope.satValue = false;

    $scope.isChecked = function(value) {
        switch (value) {
            case 'sun':
                if($scope.schedule.sun) {
                    $scope.sunValue = true;
                }
                else {
                    $scope.sunValue = false;
                }
                break;
            case 'mon':
                if($scope.schedule.mon) {
                    $scope.monValue = true;
                }
                else {
                    $scope.monValue = false;
                }
                break;
            case 'tue':
                if($scope.schedule.tue) {
                    $scope.tueValue = true;
                }
                else {
                    $scope.tueValue = false;
                }
                break;
            case 'wed':
                if($scope.schedule.wed) {
                    $scope.wedValue = true;
                }
                else {
                    $scope.wedValue = false;
                }
                break;
            case 'thu':
                if($scope.schedule.thu) {
                    $scope.thuValue = true;
                }
                else {
                    $scope.thuValue = false;
                }
                break;
            case 'fri':
                if($scope.schedule.fri) {
                    $scope.friValue = true;
                }
                else {
                    $scope.friValue = false;
                }
                break;
            case 'sat':
                if($scope.schedule.sat) {
                    $scope.satValue = true;
                }
                else {
                    $scope.satValue = false;
                }
                break;
            default:
                return false;
        }
    }

    $scope.createSchedule = function () {
        //if any one of checkbox is selected..
        if($scope.schedule.sun || $scope.schedule.mon || $scope.schedule.tue ||
            $scope.schedule.wed || $scope.schedule.thu || $scope.schedule.fri||
            $scope.schedule.sat ){
            ScheduleService.post($scope.getScheduleModel()).then(function(response){
                if(response.status == 200){
                    ToastService.showSuccessToast('Schedule');
                    $mdDialog.hide();
                }
                else {
                    ToastService.showErrorToast('Schedule');
                    $mdDialog.hide();
                }

            });
        }
           else{
        alert("You must choose days");
        }

    }

    $scope.cancelSchedule = function(){
        $mdDialog.hide();
    }


    // EDIT Section //
    $scope.loadScheduleForEdit = function () {
        ScheduleService.get({id:$scope.stateParams.id}).then(function(response){
            $scope.schedule = response.data;
        });
    }

    $scope.editState = false;
    if($scope.stateParams.actionParams.action === 'edit'){
        $scope.editState = true;
        $scope.loadScheduleForEdit();
    }

    $scope.edits = function(){
        ScheduleService.update($scope.getScheduleModel()).then(function (response) {
            if(response.status == 200){
                ToastService.showUpdateToast('Schedule');
                $state.go('scheduleDetail',{id:stateParams.id});
            }
            else {
                ToastService.showErrorUpdateToast('Schedule');
            }
        });
    }
    $scope.cancel = function(){
        $state.go('scheduleDetail',{id:stateParams.id});
    }
});



app.controller('ScheduleListCardsController', function ($scope, ScheduleService) {

    $scope.schedules;

    $scope.gridOptions = { data: 'schedules',
        columnDefs:
            [
                {field: 'name', displayName: 'Name', width: 180  },
                {field: 'from', displayName: 'From', width: 200 },
                {field: 'to', displayName: 'To', width: 200 },
            ],
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
    };

    $scope.loadAll = function(){
        ScheduleService.all().then(function(response) {
            $scope.schedules = response.data;
        });
    }

    $scope.deleteSchedule = function (id) {
        ScheduleService.delete(id).then(function(response) {
            $scope.loadAll();
        });
    }


    $scope.loadAll();

});

app.controller('ScheduleDetailController', function ($scope, $stateParams, ScheduleService) {
    $scope.stateParams = $stateParams;
    $scope.schedule = {};

    $scope.loadSchedules = function () {
        ScheduleService.get({id:$scope.stateParams.id}).then(function(response) {
            $scope.schedule = response.data;
        });
    }
    $scope.loadSchedules();
});

app.controller('ScheduleDeleteController', function ($scope, $stateParams, $state, $location, ScheduleService, ToastService) {
    var stateParams = $stateParams;
    $scope.loadSchedule = function () {
        ScheduleService.get({id:stateParams.id}).then(function(response) {
            $scope.schedule = response.data;
        });
    }

    $scope.deleteSchedule = function (param) {
        if(confirm('Are you sure ?')){
            ScheduleService.delete(param.id).then(function(response) {
                if(response.status == 200){
                    ToastService.showDeleteToast('Schedule');
                    $location.path('/schedule/all');
                }
                else {
                    ToastService.showErrorDeleteToast('Schedule');

                }
            });
        }
    }

    $scope.cancel = function(){
        $state.go('scheduleDetail',{id:stateParams.id});
    }

    $scope.loadSchedule();
});


(function () {
    app.directive('scheduleDetailInfoCard', function() {

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                schedule: '=schedule'
            },

            templateUrl:  'partial/schedule-detail-info-card',

            link: function(scope, elem, attrs) {

            },

        };
    });

})();
app.factory('ScheduleRESTClient', function ($resource) {
     return $resource('api/schedule/:id', {id: '@id'}, {
          'query': {method: 'GET', isArray: false },
          'update' : {method: 'PUT', params:{schedule : '@schedule'}, isArray: false},
          'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
     });
});

(function () {
     app.factory('ScheduleBulkRESTClient', function ($resource) {
          return $resource('api/updateBulkSchedule', {}, {
               'update' : {method: 'PUT', params:{mark : '@schedule'}, isArray: false},
          });
     });
})();
var ScheduleService = app.service('ScheduleService', function (ScheduleRESTClient, ScheduleBulkRESTClient) {
	return {
		get: function(id) {
			return ScheduleRESTClient.get({id:id.id}).$promise;
		},

		getEdit:function(id){z
			return ScheduleRESTClient.getEdit({id:id.id})
		},

		post: function(schedule){
			return ScheduleRESTClient.save(schedule).$promise;
		},
		delete: function(id){
			return ScheduleRESTClient.delete({id:id}).$promise;
		},
		all: function(){
			return ScheduleRESTClient.query().$promise;
		},

		edit: function(schedule){
			return ScheduleRESTClient.edit(schedule)
		},
		update: function(schedule){
			return ScheduleRESTClient.update(schedule).$promise;
		},

		updateBulk: function(schedule){
			return ScheduleBulkRESTClient.update(schedule).$promise;
		},

	}
});
app.controller('SessionController', function ($scope, SessionService) {

    $scope.isUserLoggedIn = true;
    $scope.isUserLoggedIn = SessionService.ping();

});
/**
 * Created by sadhikari on 8/20/2016.
 */
var UserService = app.service('SessionService', function ($http) {
    return {
        ping: function(){
            $http.get("session/ping")
                .then(function(response) {
                    console.log(response.data);
                    return response.data;
                }, function(response) {
                    console.log("Something went wrong");
                });
        },
    }
});
app.service('ToastService', function($mdToast) {
    return {
        showSuccessToast: function (message) {
            $mdToast.show (
                $mdToast.simple()
                    .textContent(message+' Created')
                    .hideDelay(4000)
                    .position('top right')

            );
        },

        showErrorToast: function (message){

            $mdToast.show (
                $mdToast.simple()
                    .textContent(message+' not Created')
                    .hideDelay(3000)
                    .position('top right')

            );
        },

        showUpdateToast: function (message){

            $mdToast.show (
                $mdToast.simple()
                    .textContent(message+' Updated')
                    .hideDelay(3000)
                    .position('top right')

            );
        },

        showErrorUpdateToast: function (message){

            $mdToast.show (
                $mdToast.simple()
                    .textContent(message+' not Updated')
                    .hideDelay(3000)
                    .position('top right')

            );
        },

        showDeleteToast: function (message){

            $mdToast.show (
                $mdToast.simple()
                    .textContent(message+' Deleted')
                    .hideDelay(3000)
                    .position('top right')

            );
        },

        showErrorDeleteToast: function (message){

            $mdToast.show (
                $mdToast.simple()
                    .textContent(message+' not Deleted')
                    .hideDelay(3000)
                    .position('top right')

            );
        },

        showSuccessMessageToast: function (message){

            $mdToast.show (
                $mdToast.simple()
                    .textContent(message+' Sent')
                    .hideDelay(3000)
                    .position('top right')

            );
        },

        showErrorMessageToast: function (message){

            $mdToast.show (
                $mdToast.simple()
                    .textContent(message+' not Sent')
                    .hideDelay(3000)
                    .position('top right')

            );
        },

        showSuccessToastMessage: function (password) {
            $mdToast.show (
                $mdToast.simple()
                    .textContent(password+' has been Changed')
                    .hideDelay(4000)
                    .position('top right')

            );
        },

        showErrorToastMessage: function (password){

            $mdToast.show (
                $mdToast.simple()
                    .textContent(password+' do not matched')
                    .hideDelay(3000)
                    .position('top right')

            );
        },



    }
});
/**
 * Created by Krishna on 10/2/2016.
 */
(function () {
app.controller('TransactionFormController', function ($scope, $stateParams, TransactionService, FilterService,  $location, $state) {
    var activeStatus = 'ACTIVE';
    var app = angular.module("app", []);
    var stateParams = $stateParams;
    $scope.transaction = {};
    $scope.stateParams = $stateParams;
    $scope.userIds;


    $scope.getRange = function(range){
        return new Array(range);
    }

    $scope.loadAllActiveUsers = function(){
        FilterService.filterUserByStatus(activeStatus).then(function(response){
            $scope.userIds = response.data;
            //console.log($scope.userIds);
        });
    };

    $scope.loadAllActiveUsers();

    $scope.getTransactionModel = function(){
        var transaction = {
            name:$scope.transaction.name,
            type:$scope.transaction.type,
            billNo:$scope.transaction.billNo,
            //amount:$scope.transaction.amount,
            remarks:$scope.transaction.remarks,
            creditAmountCents:$scope.transaction.creditAmountCents,
            crCashCountOnes:$scope.transaction.crCashCountOnes,
            crCashCountTwo:$scope.transaction.crCashCountTwo,
            crCashCountFive:$scope.transaction.crCashCountFive,
            crCashCountTen:$scope.transaction.crCashCountTen,
            crCashCountTwenty:$scope.transaction.crCashCountTwenty,
            crCashCountFifty:$scope.transaction.crCashCountFifty,
            crCashCountHundred:$scope.transaction.crCashCountHundred,
            crCashCountFiveHundred:$scope.transaction.crCashCountFiveHundred,
            crCashCountThousand:$scope.transaction.crCashCountThousand,
            debitAmountCents:$scope.transaction.debitAmountCents,
            dbCashCountOnes:$scope.transaction.dbCashCountOnes,
            dbCashCountTwo:$scope.transaction.dbCashCountTwo,
            dbCashCountFive:$scope.transaction.dbCashCountFive,
            dbCashCountTen:$scope.transaction.dbCashCountTen,
            dbCashCountTwenty:$scope.transaction.dbCashCountTwenty,
            dbCashCountFifty:$scope.transaction.dbCashCountFifty,
            dbCashCountHundred:$scope.transaction.dbCashCountHundred,
            dbCashCountFiveHundred:$scope.transaction.dbCashCountFiveHundred,
            dbCashCountThousand:$scope.dbCashCountThousand,
            isDebit:$scope.isDebit,
            isCredit:$scope.isCredit,

            // needs to implement dynamic binding
            userId:1,
        }

        if($scope.transaction.id){
            transaction['id'] = $scope.transaction.id;
        }
        return transaction;
    }


    $scope.save = function () {
        console.log($scope.getTransactionModel());
        TransactionService.post($scope.getTransactionModel()).then(function(response){
            $location.path('/dashboard.html');
            alert('Transaction successfully added in the system.'+'\n'+'Check console.log for response.');
            console.log(response);
        });
    }

    $scope.cancelTransaction = function(){
        $location.path('/dashboard.html');
    }


    // EDIT Section //
    $scope.loadTransactionForEdit = function () {
        TransactionService.get({id:$scope.stateParams.id}).then(function(response){
            $scope.transaction = response.data;
        });
    }

    $scope.editState = false;
    if($scope.stateParams.actionParams.action === 'edit'){
        $scope.editState = true;
        $scope.loadTransactionForEdit();
    }

    $scope.edit = function(){
        TransactionService.update($scope.getTransactionModel()).then(function (response) {
            $state.go('transactionDetail',{id:stateParams.id});
            alert('Transaction Updated.');
        });
    }

    $scope.cancel = function(){
        $state.go('transactionDetail',{id:stateParams.id});
    }

        //transaction form
        $scope.transactionDetails = [
            {
                'type': 'Admission Fee',
                'amount': '70000',
            },

            {
                'type':'Library Deposit',
                'amount':'10000',
            },

            {
                'type':'Extra Activities',
                'amount':'15000',

            }
        ];

    $scope.addNew = function(transactionDetail) {

        $scope.transactionDetails.push({
            'type': "",
            'amount': "",
        });

        $scope.PD = {};
    };

    $scope.remove = function(){
        var newDataList=[];
        $scope.selectedAll = false;
        angular.forEach($scope.transactionDetails, function(selected){
            if(!selected.selected){
                newDataList.push(selected);
            }
        });
        $scope.transactionDetails = newDataList;
    };

    $scope.checkAll = function () {
        if (!$scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.transactionDetails, function (transactionDetails) {
           transactionDetails.selected = $scope.selectedAll;
        });
    };

});
})();


app.controller('TransactionListCardsController', ['$scope', '$controller', 'TransactionService', function ($scope, $controller, TransactionService) {
    angular.extend(this, $controller('FilterDBStoreController', {$scope: $scope}));
    $scope.transactions = [];

    $scope.gridOptions = { data: 'transactions',
        columnDefs:
            [{field: 'id', displayName: 'ID', width: 50 },
                {field: 'name', displayName: 'Name', width: 300  }
            ],
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
    };

    $scope.loadAll = function(){
        TransactionService.all().then(function(response) {
            $scope.transactions = response.data;
        });
    }

    $scope.deleteTransaction = function (id) {
        TransactionService.delete(id).then(function(response) {
            $scope.loadAll();
        });
    }

    $scope.loadAll();

}]);

app.controller('TransactionDetailController', function ($scope, $stateParams, $mdDialog, TransactionService) {
    $scope.stateParams = $stateParams;
    $scope.transaction = {};

    $scope.loadTransactions = function () {
        TransactionService.get({id:$scope.stateParams.id}).then(function(response) {
            $scope.transaction = response.data;
        });
    }

    $scope.transactionDetail.UI.click.showFileUpload = function(ev,options) {
        $mdDialog.show({
            controller: function($scope){

            },
            templateUrl: 'partial/file-upload?forEntity=transaction&forEntityId='+$scope.transaction.id,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.loadTransactions();
});

app.controller('TransactionDeleteController', function ($scope, $stateParams, $state, $location, TransactionService) {
    var stateParams = $stateParams;
    $scope.loadTransaction = function () {
        TransactionService.get({id:stateParams.id}).then(function(response) {
            $scope.transaction = response.data;
        });
    }

    $scope.deleteTransaction = function (param) {
        if(confirm('Are you sure ?')){
            TransactionService.delete(param.id).then(function(response) {
                $location.path('/transaction/all');
            });
        }
    }

    $scope.cancel = function(){
        $state.go('transactionDetail',{id:stateParams.id});
    }

    $scope.loadTransaction();
});

(function () {
    app.directive('transactionDetailInfoCard', function() {

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                transaction: '=transaction'
            },

            templateUrl:  'partial/transaction-detail-info-card',

            link: function(scope, elem, attrs) {

            },

            controller : ['$scope','PrintService', function ($scope, PrintService) {
                $scope.printCard = function(param){
                    PrintService.printTransaction({id:param['id']});
                }
            }],

        };
    });

})();
/**
 * Created by Krishna on 10/2/2016.
 */
app.factory('TransactionRESTClient', function ($resource) {
    return $resource('api/transaction/:id', {id: '@id',transaction: '@transaction'}, {
        'query': {method: 'GET', isArray: false },
        'update' : {method: 'PUT', params:{transaction : '@transaction'}, isArray: false},
        'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
    });
});
/**
 * Created by Krishna on 10/2/2016.
 */
var TransactionService = app.service('TransactionService', function (TransactionRESTClient) {
    return {
        get: function(id) {
            return TransactionRESTClient.get({id:id.id}).$promise;
        },

        post: function(transaction){
            return TransactionRESTClient.save(transaction).$promise;
        },

        delete: function(id){
            return TransactionRESTClient.delete({id:id}).$promise;
        },

        all: function(){
            return TransactionRESTClient.query().$promise;
        },

        update: function(transaction){
            return TransactionRESTClient.update(transaction).$promise;
        }
    }
});

app.controller('DashBoardController', function ($scope) {
	$scope.gradeIndex = 0; //default load first grade..
	$scope.changeGradeIndex = function (index) {
		$scope.gradeIndex = index;
	}
});


app.controller('DashScheduleTodayController', function ($scope, $mdDialog, NoticeService, $stateParams, ToastService  ){
	$scope.stateParams = $stateParams;

		$scope.noticeDelete = function (param, event) {
			var confirm = $mdDialog.confirm()
				.title('Are you sure to delete this notice?')
				.textContent('Notice will be deleted permanently.')
				.targetEvent(event)
				.ok('Delete')
				.cancel('Cancel');
			$mdDialog.show(confirm).then(function () {
				NoticeService.delete(param.id).then(function (response) {
                    if(response.status == 200){
                        ToastService.showDeleteToast('Notice');
                        location.reload();
                    }
                    else {
                        ToastService.showErrorDeleteToast('Notice');
                    }

				})

			});
		};

		$scope.editNotice = function (notice) {
            console.log(notice);
        }
});


app.controller("TestController",['$scope',  'uiCalendarConfig', '$filter','ScheduleService','$mdDialog','$stateParams', '$state','$location','ToastService',function($scope, uiCalendarConfig, $filter, ScheduleService, $mdDialog,$stateParams, $state,$location,ToastService) {
	$scope.eventSources= new Date();
	$scope.fullCalendar=[];
	$scope.SelectedEvent= null;
	var isFirstTime= true;
	$scope.events = [];
	$scope.eventSources = [];
    $scope.events1 = [];
    $scope.schedule = {};
    $scope.stateParams = $stateParams;


    $scope.getScheduleModel = function(){
        var schedule = {
            name:$scope.schedule.name,
            description:$scope.schedule.description,
            from:$scope.schedule.from,
            to:$scope.schedule.to,
            // isFullDay:$scope.schedule.isFullDay,
        }

        if($scope.schedule.id){
            schedule['id'] = $scope.schedule.id;
        }

        return schedule;
    }

	$scope.loadEvents = function () {
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		ScheduleService.all().then(function (response) {
			$scope.events1 = response.data;
			console.log(response.data);

				$scope.events.slice(0, $scope.events.length);
				angular.forEach(response.data, function (value) {
					$scope.events.push({
						id : value.id,
						title: value.name,
						description: value.description,
						start: $scope.changeDateFormat(value.from),
						end: $scope.changeDateFormat(value.to),
						// allDay: false,
						stick: true
					});
				});
			// console.log($scope.events);
		});
	}
	$scope.loadEvents();
	$scope.eventSources = [$scope.events];

	$scope.changeDateFormat = function (date) {
		var dateObj = new Date(date);
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();

		var newdate = year + "/" + month + "/" + day;
		return newdate;
	}



    $scope.uiConfig = {
		calendar:{
			height: 450,
			editable: true,
			header:{
				left: 'month  agendaWeek agendaDay',
				center: 'title',
				right: 'today prev,next',
			},
            selectable: true,
			selectHelper: true,
			unselectAuto: true,
			displayEventTime: false,

            // select: function (start, end) {
			//     $scope.schedule.from = start;
             //    $scope.schedule.to = end;
             //    $mdDialog.show({
             //        templateUrl: 'partial/event-form',
             //        parent: angular.element(document.body),
             //        // targetEvent: event,
             //        scope: $scope,
             //        preserveScope: true,
             //        fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            //
             //    })
             //
			// },

            eventClick: function (event) {
                // console.log('clicked'+event);
                $scope.SelectedEvent = event;
                var fromDate = moment(event.start).format('YYYY/MM/DD LT');
                var endDate = moment(event.end).format('YYYY/MM/DD LT');
                console.log(fromDate);
                $scope.NewEvent = {
                    EventID : event.id,
                    StartAt : fromDate,
                    EndAt : endDate,
                    IsFullDay :false,
                    Title : event.title,
                    Description : event.description
                }
                $scope.ShowModal(event);
				}


		}
	};

    $scope.ShowModal = function (event) {
        $scope.schedule = {
            name: event.title,
            description : event.description,
            from : new Date(event.start),
            to : new Date(event.end),
            id : event.id
        }
        // console.log($scope.schedule);
        // $scope.name = event.title;
        // $scope.description = event.description;
        // $scope.from = new Date(event.start);
        // $scope.to = new Date(event.end);
        // $scope.id = event.id;
        $scope.editState = true;
        $mdDialog.show({
            templateUrl: 'partial/event-form',
            parent: angular.element(document.body),
            // controller: 'modalController',
            targetEvent: event,
            scope: $scope,
            preserveScope: true,
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        })
    }


    $scope.createEvent = function () {
        ScheduleService.post($scope.getScheduleModel()).then(function(response){
            if(response.status == 200){
                ToastService.showSuccessToast('Event');
                // $scope.events.push($scope.getScheduleModel())
                $location.path('/dashboard.html');
            }
            else {
                ToastService.showErrorToast('Event');

            }
        });

    }
    $scope.cancelEvent = function(){
        $location.path('/dashboard.html');

    }

    $scope.editEvent = function () {
        var schedule = {
            name: $scope.schedule.name,
            description: $scope.schedule.description,
            from: $scope.schedule.from,
            to: $scope.schedule.to,

        }
        // console.log(schedule);

        // ScheduleService.update(eventModel).then(function (response) {
        //    ToastService.showUpdateToast('Event');
        //     $mdDialog.hide();
        //     location.reload();
        // });

    }

    $scope.cancel = function(){
        $mdDialog.hide();

    }

    $scope.deleteEvent = function () {

    }



}]);
app.controller('CalendarController', function($scope) {
	$scope.startDate = new Date();
	// $scope.endDate = new Date();
	// $scope.maxEndDate = new Date();

	// $scope.$watch("startDate", function (val) {
	// 	var maxEndDate = new Date(val);
	// 	maxEndDate.setDate(maxEndDate.getDate() + 14);
	// 	$scope.maxEndDate = maxEndDate;
	// 	delete $scope.endDate;
	// });
});

// Please wrap every module you write in a functional expression like this
// (function () {
// })();
(function () {
    app.controller('HeaderController', function ($scope, $http, UserService, SharedService, $mdDialog, $state, ToastService) {

        $scope.user = {};
        $scope.user.userDetail = {};
        $scope.loadUser = function () {
            UserService.getLoggedInUser().then(function (response) {
                $scope.user = response.data;
            });
        }
        $scope.loadUser();


        $scope.getMatches = function (query) {
            var comparisonOp = '=';
            var filterId = 'filterUserByString';

            var params = { id: filterId };
            params.params = query;
            params.comparisonOp = comparisonOp;
            if (query.length > 0) {
                return $http.get('api/filter', { params: params }).then(function (response) {
                    return response.data.data;
                });
            }
        }

        $scope.selectedItemChangeEvent = function (item) {
            if (item) {
                $state.go('userInfoCard', { id: item.id });
            }
        }

        $scope.logout = function () {
            $http.post('api/logout', {}, {}).then(function () { location.reload(); }, function () { });
        }


        //sharing data between controllers..
        //with the help of another service
        $scope.showLeftMenu = false;
        $scope.share = function () {
            $scope.showLeftMenu ^= true;
            SharedService.prepForBroadcast($scope.showLeftMenu);
        }


        //change password pop up
        $scope.loadPasswordForm = function (ev) {
            $mdDialog.show({
                templateUrl: 'partial/change-password',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $scope.cancel = function(){
            $mdDialog.hide();
        }

        $scope.loadPasswordForm = function (ev) {
            $mdDialog.show({
                templateUrl: 'partial/change-password',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        }

        $scope.changePasswords = function (event) {

            // TODO: #1. Implement this the correct way.
            // TODO: #2. Validate passwords and interactivity of the form.

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var data = $.param({
                'old_password': $scope.user.currentPassword,
                'new_password': $scope.user.newPassword,
                'confirm_password': $scope.user.confirmPassword,
            });

            // if ($scope.user.newPassword != $scope.user.confirmPassword) {
            //     alert('Password donot matched');
            // } else {
                $http.post('/api/update-user-password', data, config)
                    .then(function (response, status, headers, config) {
                        if (response.data.code === 200) {
                            ToastService.showSuccessToastMessage('Password');
                            $mdDialog.hide();
                            location.reload();
                        }
                        else {
                            ToastService.showErrorToastMessage('Current Password');
                        }
                    }, function (error) {
                        console.log(error);
                    });
            // }



        }

    });


    //responsible for broadcasting data between controllers
    app.service('SharedService', function ($rootScope) {
        var sharedService = {};

        sharedService.showLeftMenu = false;

        sharedService.prepForBroadcast = function (flag) {
            this.showLeftMenu = flag;
            this.broadcastItem();
        };

        sharedService.broadcastItem = function () {
            $rootScope.$broadcast('handleBroadcast');
        };

        return sharedService;
    });

})();
// Please wrap every module you write in a functional expression like this
// (function () {
// })();

(function () {
app.controller('LeftMenuController', function ($scope, UserService, $state, SharedService, $mdDialog) {

    //listen the shared data channel from SharedService
    $scope.$on('handleBroadcast', function() {
        $scope.leftMenu.UI.menu.hidden = SharedService.showLeftMenu;
    })

        $scope.user = {isStudent:true};

    $scope.loadOrganizationDetail = function (ev) {
        $mdDialog.show({
            // controller: NoticeFormController,
            templateUrl: 'partial/organization-detail',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    //pop up create exam form
    $scope.loadExaminationForm = function (ev) {
        $mdDialog.show({
            templateUrl:'partial/examination-form',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });

    };

    $scope.cancelOrgDetail = function(){
        $mdDialog.hide();
    };

    // As we will be adding so many features in the left menu lets make a clean data structure to store all the flags and click events
    $scope.leftMenu = {};
    // UI
    $scope.leftMenu.UI = {
        menu:{
            hidden: false,
            language: {
                subMenu:{
                    flag:{
                        showLangOpts : false,
                    },

                }
            },
            grades: {
                subMenu:{
                    flag:{
                        showGrades : false,
                    },

                }
            },
            courses: {
                subMenu:{
                    flag:{
                        showCourses : false,
                    },

                }
            },


            attendance: {
                subMenu:{
                    flag:{
                        showAttendanceOptions : false,
                    },

                }
            },

            examination: {
                subMenu:{
                    flag:{
                        showExaminationOptions : false,
                    },

                }
            },


            administration:{
                flag: {
                    showAdministration: $scope.user['isAdministrator'],
                },
                options:[],
                // subMenu:{
                //     flag:{
                //         showAdministration : false,
                //     },
                // }
            },

            create: {
                subMenu:{
                    showCreateGrade : false,
                }
            },

            peoples: {
                subMenu: {
                    flag: {
                        showPeopleOptions : false,
                    },
                }
            },


            register: {
                subMenu: {
                    flag: {
                        showRegisterOptions : false,
                    },
                }
            },
        },






        click:{
            showLangOpts  : function () {
                $scope.leftMenu.UI.menu.language.subMenu.flag.showLangOpts ^= true; // toggling XOR
            },
            showGrades: function(){
                $scope.leftMenu.UI.menu.grades.subMenu.flag.showGrades ^= true; // toggling
            },
            showCourses: function(){
                $scope.leftMenu.UI.menu.courses.subMenu.flag.showCourses ^= true; // toggling
            },
            toggleLeftMenu: function(){
                $scope.leftMenu.UI.menu.hidden ^= true;
            },

            showPeopleOptions: function() {
                $scope.leftMenu.UI.menu.peoples.subMenu.flag.showPeopleOptions ^= true;
            },


            showAttendanceOptions: function(){
                $scope.leftMenu.UI.menu.attendance.subMenu.flag.showAttendanceOptions ^= true; // toggling
            },

            showExaminationOptions: function(){
                $scope.leftMenu.UI.menu.examination.subMenu.flag.showExaminationOptions ^= true; // toggling
            },



            showRegisterOptions: function() {
                $scope.leftMenu.UI.menu.register.subMenu.flag.showRegisterOptions ^= true;
            }
        }
    };

    $scope.loadUser = function () {
        UserService.getLoggedInUser().then(function(response) {
            $scope.user = response.data;
        });
    }

    $scope.loadUser();
});
})();
app.controller('MainLayoutController', function ($scope, UserService, $mdMedia, $mdDialog) {
    $scope.showLeftNavigation = $mdMedia('gt-sm');
    $scope.loadNoticeForm = function (ev) {
        $mdDialog.show({
            // controller: NoticeFormController,
            templateUrl: 'partial/notice-form',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

});

app.controller('UserFormController', function ($scope,$filter, $stateParams, ToastService, UserService, RoleService, GradeService, $mdDialog, AddressService, $location, $state) {
    $scope.user = {};
    $scope.user.userDetail = {};
    $scope.stateParams = $stateParams;
    var stateParams = $stateParams;
    $scope.getUserModel = function () {
        if ($scope.editState) {
            var user = {
                roleId: $scope.user.roles.id,
                gradeId: $scope.user.grades[0].id,
                email: $scope.user.email,
                password: $scope.user.password,
                confirm: $scope.user.confirm,
                firstName: $scope.user.userDetail.firstName,
                lastName: $scope.user.userDetail.lastName,
                dob: $scope.newDate,
                contactNumber: $scope.user.userDetail.contactNumber,
                // mothersName:$scope.user.userDetail.mothersName,
                parentContactNumberOne: $scope.user.userDetail.parentContactNumberOne,
                // parentContactNumberTwo:$scope.user.userDetail.parentContactNumberTwo,
                guardianName: $scope.user.userDetail.guardianName,
                gender: $scope.user.userDetail.gender,
                address: $scope.user.address.address,
                state: $scope.user.address.state,
                district: $scope.user.address.district,
            }
        }
        else {
            var user = {
                roleId: $scope.user.roles.id.id,
                gradeId: $scope.user.grades[0].id,
                email: $scope.user.email,
                password: $scope.user.password,
                confirm: $scope.user.confirm,
                firstName: $scope.user.userDetail.firstName,
                lastName: $scope.user.userDetail.lastName,
                dob: $scope.newDate,
                contactNumber: $scope.user.userDetail.contactNumber,
                // mothersName:$scope.user.userDetail.mothersName,
                parentContactNumberOne: $scope.user.userDetail.parentContactNumberOne,
                // parentContactNumberTwo:$scope.user.userDetail.parentContactNumberTwo,
                guardianName: $scope.user.userDetail.guardianName,
                gender: $scope.user.userDetail.gender,
                address: $scope.user.address.address,
                state: $scope.user.address.state,
                district: $scope.user.address.district,


            }
            // alert(user);
        }

        if ($scope.user.id) {
            user['id'] = $scope.user.id;
        }
        return user;
    }

    $scope.loadAllRoles = function () {
        RoleService.all().then(function (response) {
            $scope.roles = response.data;

        });
    }
    $scope.loadAllRoles();

    $scope.signUp = function (options) {
        UserService.post($scope.getUserModel())
            .then(function (response) {
                    // console.log(response);
                    if (response.status == 200) {
                        ToastService.showSuccessToast('User');
                        $mdDialog.hide();
                        location.reload();
                    }
                    else {
                        ToastService.showErrorToast('User');
                    }

                },
                function () {
                }
            )
        ;
    }

    $scope.cancelUser = function () {
        $mdDialog.hide();
    }

    // EDIT Section //
    $scope.loadUserForEdit = function () {

        console.log('userId' + $scope.userId);
        UserService.get({id: $scope.userId}).then(function (response) {
            $scope.user = response.data;
            // for datepopulate
            var collectionDate = $scope.user.userDetail.dob;
            $scope.newDate =new Date(collectionDate);

            console.log($scope.user);
        });
    }


    if ($scope.editState == true) {
        $scope.loadUserForEdit();
    }
    //
    // $scope.editState = false;
    // if($scope.stateParams.actionParams.action === 'edit'){
    //     $scope.editState = true;
    //     $scope.loadUserForEdit();
    // }


    $scope.editUser = function () {
        UserService.update($scope.getUserModel()).then(function (response) {
            if (response.status == 200) {
                ToastService.showUpdateToast('User');
                $mdDialog.hide();
                location.reload();
                // $state.go('userProfile',{id:stateParams.id});
            }
            else {
                ToastService.showErrorUpdateToast('User');
            }

        });
    }

    $scope.cancel = function () {
        $mdDialog.hide();
    }
    $scope.getDistricts = function(selectedState) {

        // get the selected bank object from the banks array
        var filteredState = $filter('filter')($scope.address_state, selectedState);

        // return the branches of the selected bank
        return filteredState[0].districts;
    };


    $scope.address_state = [

        {
            state: "State No 1",
            districts: ["Bhojpur", "Dhankuta", "Illam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"]
        },


        {
            state: "State No 2",
            districts: ["Saptari", "Siraha", "Dhanusa", "Mahottari", "Sarlahi", "Bara","Parsa", "Rautahat"]
        },

        {
            state: "State No 3",
            districts: ["Sindhuli", "Ramechhap", "Dolakha", "Bhaktapur", "Dhading", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Nuwakot", "Rasuwa", "Sindhupalchok", "Chitwan", "Makwanpur"]
        },

        {
            state: "State No 4",
            districts: ["Gorkha", "Kaski", "Lamjung", "Manang", "Syangja", "Tanahu", "Nawalpur", "Baglung", "Myagdi", "Parbat", "Mustang"]
        },

        {
            state: "State No 5",
            districts: ["Arghakhanchi", "Gulmi", "Kapilvastu", "Palpa", "Rupandehi","Parasi","Dang","Pyuthan","Rolpa","Eastern Rukum","Banke","Bardia"]
        },

        {
            state: "State No 6",
            districts: ["West Rukum", "Salyan", "Dolpa", "Humla", "Jumla", "Kalikot", "Mugu", "Surkhet", "Dailekh", "Jajarkot"]
        },

        {
            state: "State No 7",
            districts: ["Achham", "Bajhang", "Bajura", "Doti", "Kailali","Baitadi", "Dadeldhura", "Darchula", "Kanchanpur"]
        }

    ]

    $scope.loadGrades = function () {
        GradeService.all().then(function (response) {
            $scope.grades = response.data.grades;
        });
    }

    $scope.loadGrades();

});

(function () {
    app.controller('UserListCardsController', ['$scope', '$controller', 'UserService', '$mdDialog', 'ToastService', '$stateParams', function ($scope, $controller, UserService, $mdDialog, ToastService, $stateParams) {
        angular.extend(this, $controller('FilterDBStoreController', {$scope: $scope}));
        $scope.users = [];


        $scope.stateParams = $stateParams;

        $scope.userListCardDelete = function (param, event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this user?')
                .textContent('Record will be deleted permanently.')
                .targetEvent(event)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                UserService.delete(param.id).then(function (response) {
                    if (response.status == 200) {
                        ToastService.showDeleteToast('User');
                        location.reload();
                    }
                    else {
                        ToastService.showErrorDeleteToast('User');
                    }

                })

            });
        }
        $scope.loadAll = function () {
            var allDisplayIDs = $scope.mainFilter.getListOfEntityIDsToShow();
            console.log($scope.mainFilter.getListOfEntityIDsToShow());
            if (allDisplayIDs !== undefined && allDisplayIDs.length > 0) {
                var multipleIDSearch = {findByIds: allDisplayIDs.join(',')};
                UserService.all(multipleIDSearch).then(
                    function (response) {
                        $scope.users = response.data;
                        // console.log($scope.users);
                    });
            }
        }

        //user pop-up edit form
        $scope.userEdit = function (userId, ev) {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: 'partial/user-form',
                clickOutsideToClose: false,
                locals: {
                    userId: userId,
                    editState: true
                },
                controller: ['$scope', 'userId', 'editState', function ($scope, userId, editState) {
                    // share data to control being used by partial/user-form
                    $scope.userId = userId;
                    $scope.editState = editState
                }]
            });
        }

        // pop up user form
        $scope.loadUserForm = function (ev) {
            $mdDialog.show({
                templateUrl: 'partial/user-form',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

    }]);
})();

(function () {
    app.controller('UserProfileController', function ($scope, $stateParams, UserService, AttendanceService, $mdDialog, UserJSON) {
        $scope.stateParams = $stateParams;
        $scope.user = {};

        // UI
        $scope.userInfoCard = {};
        $scope.userProfile = {};
        $scope.userProfile.UI = {flag: {}, click: {}};

        $scope.noOfattendanceRecords = 0;

        $scope.presentOrAbsentStyle = 'md-raised';

        $scope.user = UserJSON;

        // EDIT Section //
        $scope.loadUserForEdit = function () {
            console.log('userId' + $scope.userId);
            UserService.get({id: $scope.userId}).then(function (response) {
                $scope.user = response.data;
                console.log($scope.user);
            });
        }


        if ($scope.editState == true) {
            $scope.loadUserForEdit();
        }

        //user pop-up edit form
        $scope.userEdit = function (userId, ev) {
            $mdDialog.show({
                targetEvent: ev,
                templateUrl: 'partial/user-form',
                clickOutsideToClose: false,
                locals: {
                    userId: userId,
                    editState: true
                },
                controller: ['$scope', 'userId', 'editState', function ($scope, userId, editState) {
                    // share data to control being used by partial/user-form
                    $scope.userId = userId;
                    $scope.editState = editState
                }]
            });
        }

        $scope.loadUser = function () {
            UserService.get({id: $scope.stateParams.id}).then(function (response) {
                $scope.user = response.data;
            });
        }

        $scope.present = function () {
            AttendanceService.present({userId: $scope.user.id, comment: ''}).then(function (response) {
                $scope.loadUser();
            });
        }

        $scope.absent = function () {
            AttendanceService.absent({userId: $scope.user.id, comment: ''})
                .then(function (response) {
                    $scope.loadUser();
                });
        }


    });
})();

app.controller('UserDeleteController', function ($scope, $stateParams, ToastService, $state, $location, UserService) {
    var stateParams = $stateParams;

    $scope.user = {};

    $scope.loadUser = function () {
        UserService.get({id: stateParams.id}).then(function (response) {
            $scope.user = response.data;
        });
    }

    $scope.deleteUser = function (param) {
        if (confirm('Are you sure ?')) {
            UserService.delete(param.id).then(function (response) {
                if (response.status == 200) {
                    ToastService.showDeleteToast('User');
                    $location.path('/people.html');
                }
                else {
                    ToastService.showErrorDeleteToast('User');

                }
            });
        }
    }

    $scope.cancel = function () {
        $state.go('userProfile', {id: stateParams.id});
    }

    $scope.loadUser();
});

app.controller('UserDiscussionController', function ($scope, $stateParams, ProductMsgService, UserService) {

    $scope.threads = {};


    $scope.loadAll = function () {
        ProductMsgService.all().then(function (response) {
            $scope.threads = response.data;
            // console.log($scope.threads);

        });

        UserService.get({id: $stateParams.id}).then(function (response) {
            $scope.user = response.data;
        });


    }


    $scope.loadAll();

});

app.controller('UserExaminationController', function ($scope, $stateParams, UserService) {


    $scope.stateParams = $stateParams;
    $scope.user = {};
    $scope.loadUser = function () {
        UserService.get({id: $scope.stateParams.id}).then(function (response) {
            $scope.user = response.data;
            $scope.user.courses = response.data.courses;
            console.log($scope.user.courses);
        });
    }
    $scope.loadUser();
});

app.controller('UserViewAttendanceController', function ($scope, $stateParams, UserService, GradeService, AttendanceService) {

    $scope.stateParams = $stateParams;
    $scope.users = {};
    $scope.months = [];
    $scope.attendance = {};


    $scope.getUserViewAttendance = function () {
        var options = {
            userId: $scope.user.id,
            monthNP: $scope.attendance.monthNp
        }
        console.log(options);
        AttendanceService.query(options).then(function (response) {
            $scope.user = response.data.user;
            $scope.noOfDays = response.data.noOfDays;
        });

    }

    $scope.loadUser = function () {
        UserService.get({id: $scope.stateParams.id}).then(function (response) {
            $scope.user = response.data;

        });
    }

    $scope.loadMonths = function () {
        var months = [
            {id: 1, name: 'Jan'},
            {id: 2, name: 'Feb'},
            {id: 3, name: 'Mar'},
            {id: 4, name: 'Apr'},
            {id: 5, name: 'May'},
            {id: 6, name: 'Jun'},
            {id: 7, name: 'July'},
            {id: 8, name: 'Aug'},
            {id: 9, name: 'Sept'},
            {id: 10, name: 'Oct'},
            {id: 11, name: 'Nov'},
            {id: 12, name: 'Dec'},
        ];
        $scope.months = months;
    }

    $scope.loadMonths();
    $scope.loadUser();
});






(function () {
    app.directive('userDetailInfoCard', function() {

        return {
            restrict: 'EA',

            // transclude: false,

            scope: {
                user: '=user'
            },

            templateUrl:  'partial/user-detail-info-card',

            link: function(scope, elem, attrs) {
            },

            controller : ['$scope','PrintService', function ($scope, PrintService) {
                $scope.printCard = function(param){
                    PrintService.printUser({id:param['id']});
                }
            }],

        };
    });

})();
(function () {
app.factory('UserRESTClient', function ($resource) {
     var customerParameters = {};

     return $resource('api/user/:id', {id: '@id',user: '@user'}, {
          'query': {method: 'GET',
                    params:{
                         customParameters:'@customParams',
                         options:'@options',
                         findByIds:'@findByIds'
                         },
                    isArray:false},
          'update' : {method: 'PUT', params:{user : '@user'}, isArray: false},
          'delete' : {method: 'DELETE', params:{id:'@id'}, isArray: false}
     });
});
})();


(function() {

    app.directive('compareTo', function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    })


}());

var UserService = app.service('UserService', function (UserRESTClient) {

	return {
        query: function(options){
            return UserRESTClient.query(options).$promise;
        },

        get: function(id) {
			return UserRESTClient.get({id:id.id}).$promise;
		},

		post: function(user){
			return UserRESTClient.save(user).$promise;
		},

		delete: function(id){
			return UserRESTClient.delete({id:id}).$promise;
		},

		all: function(options){
			return UserRESTClient.query(options).$promise;
		},

		update: function(user){
			return UserRESTClient.update(user).$promise;
		},

		getLoggedInUser: function () {
			return this.get({id:product_GLOBALS_userId});
		}
	}
});