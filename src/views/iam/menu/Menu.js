export default {
  name: 'manage-menu',
  components: {  },
  data() {
    return {
      //tree-table 标题列数据
      columns: [
        {
          text: 'name',
          value: 'name',
        },
        {
          text: 'displayName',
          value: 'displayName',
        },
        {
          text: 'permission',
          value: 'permission',
        },
        {
          text: 'accessUri',
          value: 'accessUri',
        },
      ],
      //tree-table 行数据
      data: [],
      // 列表按钮配置
      btn_info: {
        width: 280,
        add_text: 'add lower level',
        update_text: 'modify',
        delete_text: 'del',
      },

      //form 属性
      formFields: {
        id: '',
        name: '',
        displayName: '',
        parentId: '',
        permission: '',
        accessUri: '',
        icon: '',
        sort: '',
      },

      //验证
      rules: {
        moduleName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        aliasName: [{ required: true, message: '请输入别名', trigger: 'blur' }],
        belongTo: [{required: true, message: '请选择所属系统', trigger: 'blur' }],
        moduleOrder: [{required: true, name:'排序', validator: this.$validate_isPositiveInteger, trigger: 'blur'}]
      },

      //弹窗控制
      dialogVisible: false,
      //用于锁定确认按钮，避免重复提交
      dialogSubmitBtnSwith: false,
      //窗口标题
      windowTitle: '',    
      //弹窗定位    
      labelPosition: 'right',

    }
  },
  methods : {
    /**
     * 获取列表
     */
    onGetList() {
      this.$$api_iam_getMenuTree({
        fn: data => {
          this.data = data.data.data;
        }
      })
    },

     /**
     * 点击删除按钮
     */
    onClickBtnDelete(opts) {
      this.$confirm('请小心！！！子菜单会连同一起删除，是否继续？', '确认删除？').then(() => {
        this.$$api_iam_delMenu({
          data: {id : opts.data.id},
          fn: data => {
            this.onGetList();
          }
        })
      })
    },
    /**
     * 添加下级菜单按钮
     */
    onClickBtnAdd(opts) {
      this.emptyFormFieldsAndEnableDialogSubmitBtn();
      this.windowTitle = '添加['+opts.data.displayName+']的下级菜单';
      this.dialogVisible = true;
      this.formFields.parentId = opts.data.id;
    },
    /**
     * 修改按钮
     */
    onClickBtnUpdate(opts) {
      this.emptyFormFieldsAndEnableDialogSubmitBtn();
      console.info(opts);
      this.windowTitle = '修改['+opts.data.displayName+']菜单';
      this.dialogVisible = true;
      this.formFields = {
        id: opts.data.id,
        name: opts.data.name,
        displayName: opts.data.displayName,
        parentId: opts.data.parentId,
        permission: opts.data.permission,
        accessUri: opts.data.accessUri,
        icon: opts.data.icon,
        sort: opts.data.sort,
      }
    },
    /**
     * 清空所有的绑定属性，用于切换form的时候
     */    
    emptyFormFieldsAndEnableDialogSubmitBtn(){
      if(this.$refs['menuForm']) {
        this.$refs['menuForm'].resetFields();
      }
      this.formFields = {
        id: '',
        name: '',
        displayName: '',
        parentId: '',
        permission: '',
        accessUri: '',
        icon: '',
        sort: '',
      };
    },
    /**
     * 添加顶级菜单
     */    
    addTopLevelModule(){
      this.emptyFormFieldsAndEnableDialogSubmitBtn();
      this.dialogVisible = true;
      this.windowTitle = '添加顶级菜单';
      this.formFields.parentId = 0;
    },
    /**
     * 添加或者保存
     */     
    save(){
      this.$$api_iam_saveMenu({
        data: this.formFields,
        fn: data => {
          this.$message({
            message: 'save success',
            type: 'success'
          });
          this.dialogVisible = false;
          this.onGetList();
        },
        errFn: () => {
          this.$message.error('save fail');
        }
      })
    },

    /**
     * 菜单树节点选中事件
     */      
    /*checkChange(node){
      this.formFields.parentModuleId = node.moduleId
      this.formFields.parentModuleName = node.moduleName + ' / ' + node.levelLabel
    },*/
  },
  mounted() {
    this.onGetList();
  },
  watch:{
  }
}