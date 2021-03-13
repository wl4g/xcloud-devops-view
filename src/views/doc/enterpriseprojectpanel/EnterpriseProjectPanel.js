// Generated by XCloud DevOps for Codegen, refer: http://dts.devops.wl4g.com
import {transDate, getDay} from 'utils/'

export default {
    name: 'enterpriseProjectPanel',
    data() {
        return {

            //group part
            groupDialogVisible: false,
            groupSaveForm: {
                name: '',
            },


            //project part


            //查询条件
            searchParams: {
                groupId: '',
                teamId: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 999,

            //弹窗表单
            saveForm: {
                name: '',
                groupId: '',
                teamId: '',
                visibility: '',
                json: '',
                remark: '',
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            teams: [],

            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'name is empty', trigger: 'change' },
                ],
                visibility: [
                    {required: true, message: 'visibility is empty', trigger: 'change' },
                ],
            },
            loading: false
        }
    },

    mounted() {
        this.getGroup();
    },
    methods: {

        //==================== Group part start ====================
        getGroup(){
            this.loading = true;
            this.searchParams.pageNum = this.pageNum;
            this.searchParams.pageSize = this.pageSize;
            this.$$api_doc_enterpriseGroupList({
                data: this.searchParams,
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
        addGroup(){
            this.cleanGroupForm();
            this.dialogTitle = '新增'
            this.groupDialogVisible = true;
        },
        saveGroup() {
            this.dialogLoading = true;
            this.$refs['groupSaveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_doc_saveEnterpriseGroup({
                        data: this.groupSaveForm,
                        fn: json => {
                            this.dialogLoading = false;
                            this.groupDialogVisible = false;
                            this.cleanGroupForm();
                            this.getGroup();
                        },
                        errFn: () => {
                            this.dialogLoading = false;
                        }
                    });
                }else {
                    this.dialogLoading = false;
                }
            });
        },
        cleanGroupForm() {
            this.groupSaveForm = {
                name: '',
            };
        },
        editGroup(item) {
            if (!item.id) {
                return;
            }
            this.cleanSaveForm();
            this.$$api_doc_enterpriseGroupDetail({
                data: {
                    id: item.id,
                },
                fn: json => {
                    this.groupSaveForm = json.data;
                },
            });
            this.groupDialogVisible = true;
            this.dialogTitle = 'Edit';
        },
        delGroup(item) {
            if (!item.id) {
                return;
            }
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_doc_delEnterpriseGroup({
                    data: {
                        id: item.id,
                    },
                    fn: json => {
                        this.$message({
                            message: 'Success',
                            type: 'success'
                        });
                        this.getGroup();
                    },
                })
            }).catch(() => {
                //do nothing
            });
        },


        //==================== Group part end ====================


        //==================== Project part start ====================

        onSubmit() {
            this.getData();
        },
        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },
        addData(item) {
            this.getTeam();
            this.cleanSaveForm();
            this.saveForm.groupId = item.id;
            this.dialogVisible = true;
            this.dialogTitle = 'Add';
        },
        // 获取列表数据
        getTeam() {
            this.$$api_doc_enterpriseTeamList({
                data: {
                    pageSize: 999,
                },
                fn: json => {
                    this.teams = json.data.records;
                },
                errFn: () => {

                }
            })
        },
        cleanSaveForm() {
            this.saveForm = {
                groupId: '',
                teamId: '',
                visibility: '',
                json: '',
                remark: '',
            };
        },
        saveData() {
            this.dialogLoading = true;
            this.saveForm.hostId = this.searchParams.hostId;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_doc_saveEnterpriseProject({
                        data: this.saveForm,
                        fn: json => {
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.getGroup();
                            this.cleanSaveForm();
                        },
                        errFn: () => {
                            this.dialogLoading = false;
                        }
                    });
                }else {
                    this.dialogLoading = false;
                }
            });
        },
        editData(row) {
            if (!row.id) {
                return;
            }
            this.getTeam();
            this.cleanSaveForm();
            this.$$api_doc_enterpriseProjectDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = json.data;
                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Edit';
        },
        delData(row) {
            if (!row.id) {
                return;
            }
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_doc_delEnterpriseProject({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.$message({
                            message: 'Success',
                            type: 'success'
                        });
                        this.getGroup();
                    },
                })
            }).catch(() => {
                //do nothing
            });
        },

        //==================== Project part end ====================

        toProjectDetail(id){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('udm:enterpriseapi'),query: {id:id}})
        },

    }
}
