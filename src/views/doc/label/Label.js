import {transDate, getDay} from 'utils/'

export default {
    name: 'myLabel',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],


            // 表单规则
            rules: {

                name: [
                    {required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
            },
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

        addData() {
            this.cleanSaveForm();
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Add Label';
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_doc_labelList({
                data: {
                    name: this.searchParams.name,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: data => {
                    this.loading = false;
                    this.total = data.data.total;
                    this.tableData = data.data.records;
                },
                errFn: () => {
                    this.loading = false;
                }
            })
        },
        cleanSaveForm() {
            this.saveForm = {
                id: '',
                name: '',
            };

        },

        saveData() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_doc_saveLabel({
                        data: this.saveForm,
                        fn: data => {
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.getData();
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
            this.$$api_doc_labelDetail({
                data: {
                    id: row.id,
                },
                fn: data => {
                    this.saveForm = {
                        id: data.data.id,
                        name: data.data.name,
                    };
                }
            });
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Edit Label';
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
                this.$$api_doc_delLabel({
                    data: {
                        id: row.id,
                    },
                    fn: data => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getData();
                    },
                })
            }).catch(() => {
                //do nothing
            });
        },


    }
}