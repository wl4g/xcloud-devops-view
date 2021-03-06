import {transDate, getDay} from 'utils/'

export default {
    name: 'templat',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
                metricId: '',
                classify: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                metricId: '',
                classify: '',
                notifyLevel: '',
                tagMap: [],
                rules: [],
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            metricList: [],
            metricList2: [],
            loading: false
        }
    },

    mounted() {
        this.getData();

    },

    methods: {

        onSubmit() {
            this.getData();
        },

        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },

        addTemplat() {
            this.cleanSaveForm();
            this.dialogVisible = true;
            this.dialogTitle = '新增';
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_umc_templatList({
                data: {
                    name: this.searchParams.name,
                    metricId: this.searchParams.metricId,
                    classify: this.searchParams.classify,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    this.loading = false;
                    this.total = json.data.total;
                    this.tableData = json.data.records;
                },
                errFn: () => {
                    this.loading = false;
                }
            })
        },

        cleanSaveForm() {
            this.saveForm.id = '';
            this.saveForm.name = '';
            this.saveForm.metricId = '';
            this.saveForm.classify = '';
            this.saveForm.notifyLevel = '';
            this.saveForm.tagMap = [];
            this.saveForm.rules = [];
        },

        deleteTag(index) {
            this.saveForm.tagMap.splice(index, 1);
        },

        addTag() {
            if(!this.saveForm.tagMap){
                this.saveForm.tagMap = [];
            }
            this.saveForm.tagMap.push({
                name: '',
                value: '',
            })
        },

        deleteRule(index) {
            this.saveForm.rules.splice(index, 1);
        },

        addRule() {
            this.saveForm.rules.push({
                logicalOperator: 1,
                aggregator: '',
                relateOperator: '',
                value: '',
                queueTimeWindow: '',
                alarmLevel: '',
            })
        },


        saveTemplat() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_umc_saveTemplat({
                        data: this.saveForm,
                        fn: json => {
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.getData();
                            this.cleanSaveForm();
                        },
                        errFn: () => {
                            this.dialogLoading = false;
                        }
                    });
                } else {
                    this.dialogLoading = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        editTemplat(row) {
            this.cleanSaveForm();
            if (!row.id) {
                return;
            }
            this.$$api_umc_templatDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = json.data.alarmTemplate;

                    //
                    this.saveForm.tags = '';
                    this.saveForm.tagsMap = null;
                }
            })

            this.dialogVisible = true;
            this.dialogTitle = '编辑';
        },


        delTemplat(row) {
            if (!row.id) {
                return;
            }
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_umc_delTemplat({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getData();
                    }
                })
            }).catch(() => {
                //do nothing
            });

        },


        convertClassifyValue(value){
            console.debug("convertClassifyValue"+value);

            if (value == 'basic') {
                return 'basic';
            }
            if (value == 'docker') {
                return 'docker';
            }
            if (value == 'redis') {
                return 'redis';
            }
            if (value == 'kafka') {
                return 'kafka';
            }
            if (value == 'zookeeper') {
                return 'zookeeper';
            }
            return '--';
        },

        convertLevelValue(value){
            console.debug("convertLevelValue:"+value);
            if (value == 1) {
                return 'warn';
            }
            if (value == 2) {
                return 'error';
            }
            if (value == 3) {
                return 'danger';
            }
            if (value == 4) {
                return 'death';
            }

            return '--';
        },

        convertStatusType(value){
            if (value == 1) {
                return 'warning';
            }
            if (value == 3) {
                return 'success';
            }
            if (value == 3) {
                return 'danger';
            }
            if (value == 4) {
                return 'danger';
            }
            return 'danger';
        },


        getMetricByClassify(){
            this.$$api_umc_getMetricByClassify({
                data: {
                    classify: this.searchParams.classify,
                },
                fn: json => {
                    this.metricList = json.data.list;
                }
            })
        },

        getMetricByClassifyForm(){
            this.$$api_umc_getMetricByClassify({
                data: {
                    classify: this.saveForm.classify,
                },
                fn: json => {
                    this.metricList2 = json.data.list;
                }
            })
        }




    }
}
