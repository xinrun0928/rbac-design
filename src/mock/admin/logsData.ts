import type { SysAccessLog, SysMessageLog, SysHttpLog, SysLoginLog } from '@/types/admin/logs'

/** 系统访问日志 Mock 数据 */
export const mockAccessLogData: SysAccessLog[] = [
  {
    id: '2071612890162532352',
    name: '上报经纬度',
    req_url: '/mobile/task/location/upload',
    op_method: 'POST',
    ip: '131.87.2.58',
    req_params: '{"taskId":2070857469110845442,"recordId":2071610968789618688,"longitude":113.28156641263065,"latitude":23.11629919969752,"distanceFromLast":3.36}',
    rep_time: '8',
    class_name: 'com.infoview.business.flood.mobile.task.MobileFloodInspectionLocationController.uploadLocation',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 2,
    module_type: 11106,
    status: 1101,



    create_time: '2026-06-29 23:12:56',
    update_time: '2026-06-29 23:12:56',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071613104369831936',
    name: '继续巡检',
    req_url: '/mobile/task/record/resume',
    op_method: 'PUT',
    ip: '131.87.1.156',


    rep_time: '10',
    class_name: 'com.infoview.business.flood.mobile.task.MobileFloodInspectionRecordController.resume',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'MSEdge',
    os: 'iPhone',
    op_type: 0,
    func_type: 3,
    module_type: 11105,
    status: 1101,



    create_time: '2026-06-29 23:13:47',
    update_time: '2026-06-29 23:13:47',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071613271668035584',
    name: '暂停巡检',
    req_url: '/mobile/task/record/pause',
    op_method: 'PUT',
    ip: '131.87.2.58',


    rep_time: '10',
    class_name: 'com.infoview.business.flood.mobile.task.MobileFloodInspectionRecordController.pause',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 3,
    module_type: 11105,
    status: 1101,



    create_time: '2026-06-29 23:14:27',
    update_time: '2026-06-29 23:14:27',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071613485292326912',
    name: '用户名密码登录',
    req_url: '/auth/login',
    op_method: 'POST',
    ip: '131.87.2.58',
    req_params: '{"loginName":"15113557525","password":"******","terminal":"inspector"}',
    rep_time: '129',
    class_name: 'com.infoview.business.flood.rbac.auth.controller.AuthController.login',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 1,
    module_type: 1,
    status: 1101,



    create_time: '2026-06-29 23:15:18',
    update_time: '2026-06-29 23:15:18',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071613492477169664',
    name: '选择组织登录',
    req_url: '/auth/login/selectOrganization',
    op_method: 'POST',
    ip: '131.87.2.58',
    req_params: '{"puserId":2061290765434359808,"orgId":2066055337991081984,"password":"******","terminal":"inspector"}',
    rep_time: '273',
    class_name: 'com.infoview.business.flood.rbac.auth.controller.AuthController.selectOrganizationLogin',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 1,
    module_type: 1,
    status: 1101,



    create_time: '2026-06-29 23:15:19',
    update_time: '2026-06-29 23:15:19',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071614144888573952',
    name: '暂停巡检',
    req_url: '/mobile/task/record/pause',
    op_method: 'PUT',
    ip: '131.87.2.58',


    rep_time: '15',
    class_name: 'com.infoview.business.flood.mobile.task.MobileFloodInspectionRecordController.pause',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 3,
    module_type: 11105,
    status: 1101,



    create_time: '2026-06-29 23:17:55',
    update_time: '2026-06-29 23:17:55',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071614168544448512',
    name: '完成巡检',
    req_url: '/mobile/task/record/finish',
    op_method: 'PUT',
    ip: '131.87.2.58',


    rep_time: '13',
    class_name: 'com.infoview.business.flood.mobile.task.MobileFloodInspectionRecordController.finish',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 3,
    module_type: 11105,
    status: 1101,



    create_time: '2026-06-29 23:18:01',
    update_time: '2026-06-29 23:18:01',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071615840633098240',
    name: '用户名密码登录',
    req_url: '/auth/login',
    op_method: 'POST',
    ip: '131.87.2.58',
    req_params: '{"loginName":"18113557525","password":"******","terminal":"inspector"}',
    rep_data: '用户名或密码错误',
    rep_time: '36',
    class_name: 'com.infoview.business.flood.rbac.auth.controller.AuthController.login',
    result: 'FAIL',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 1,
    module_type: 1,
    status: 1101,



    create_time: '2026-06-29 23:24:39',
    update_time: '2026-06-29 23:24:39',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071616014797377536',
    name: '开始巡检',
    req_url: '/mobile/task/record/start',
    op_method: 'POST',
    ip: '131.87.2.58',
    req_params: '{"taskId":2070857073340514306,"lineNo":"G94","sectionName":"广珠西线高速（G94中山段）","inspectorCount":1,"inspectorList":[{"userId":"2069755365553213440","name":"戴世杰"}],"recorder":"戴世杰","direction":"G94440050100","startPileNo":"348.269","startLongitude":0,"startLatitude":0,"remark":""}',
    rep_time: '23',
    class_name: 'com.infoview.business.flood.mobile.task.MobileFloodInspectionRecordController.start',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 2,
    module_type: 11105,
    status: 1101,



    create_time: '2026-06-29 23:25:21',
    update_time: '2026-06-29 23:25:21',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071616755171725312',
    name: '修改组织',
    req_url: '/organization/update',
    op_method: 'PUT',
    ip: '131.87.2.218',


    rep_time: '60',
    class_name: 'com.infoview.business.flood.rbac.organization.controller.FloodOrgOrganizationController.update',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'OSX',
    op_type: 0,
    func_type: 3,
    module_type: 11101,
    status: 1101,



    create_time: '2026-06-29 23:28:17',
    update_time: '2026-06-29 23:28:17',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071617164913283072',
    name: '用户名密码登录',
    req_url: '/auth/login',
    op_method: 'POST',
    ip: '131.87.0.126',
    req_params: '{"loginName":"15113557525","password":"******","terminal":"inspector"}',
    rep_time: '116',
    class_name: 'com.infoview.business.flood.rbac.auth.controller.AuthController.login',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 1,
    module_type: 1,
    status: 1101,



    create_time: '2026-06-29 23:29:55',
    update_time: '2026-06-29 23:29:55',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071618214714019840',
    name: '新增巡检成员',
    req_url: '/organization/member/save',
    op_method: 'POST',
    ip: '131.87.2.218',
    req_params: '{"orgId":2071603369360887808,"name":"黎武军","loginName":"13609053533","password":"******","phone":"","sex":0,"email":"","status":1101,"avatar":"","remark":"","roleIds":[3]}',
    rep_time: '148',
    class_name: 'com.infoview.business.flood.rbac.organization.controller.FloodOrgMemberController.save',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'OSX',
    op_type: 0,
    func_type: 2,
    module_type: 11101,
    status: 1101,



    create_time: '2026-06-29 23:34:05',
    update_time: '2026-06-29 23:34:05',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071619984202797056',
    name: '刷新令牌',
    req_url: '/auth/refresh',
    op_method: 'POST',
    ip: '131.87.2.58',
    req_params: 'KHbzBVDKdFr_cUk369hKwWjyD_4fADhAxdBrCzouYswDaELS7oEGDP_TMLfJmgvMmtgspFeCvw3heL3YtbBSQ_kvP21AytpbR2uK0AAIJipDrq74KlH9VgEgD3Aj4s6d',
    rep_data: '令牌刷新失败，请重新登录',
    rep_time: '133',
    class_name: 'com.infoview.business.flood.rbac.auth.controller.AuthController.refreshToken',
    result: 'FAIL',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 1,
    module_type: 1,
    status: 1101,



    create_time: '2026-06-29 23:41:07',
    update_time: '2026-06-29 23:41:07',
    deleted: 0,
    signature_version: '0'
  },
  {
    id: '2071620592414625792',
    name: '开始巡检',
    req_url: '/mobile/task/record/start',
    op_method: 'POST',
    ip: '131.87.2.58',
    req_params: '{"taskId":2070857073340514306,"lineNo":"G94","sectionName":"广珠西线高速（G94中山段）","inspectorCount":2,"inspectorList":[{"userId":"2071273943515402240","name":"测试用户1"}],"recorder":"测试用户1","direction":"G94440050300","startPileNo":"390.403","startLongitude":0,"startLatitude":0,"remark":""}',
    rep_time: '20',
    class_name: 'com.infoview.business.flood.mobile.task.MobileFloodInspectionRecordController.start',
    result: 'SUCCESS',

    org_id: 0,
    browser: 'Chrome',
    os: 'Android',
    op_type: 0,
    func_type: 2,
    module_type: 11105,
    status: 1101,



    create_time: '2026-06-29 23:43:32',
    update_time: '2026-06-29 23:43:32',
    deleted: 0,
    signature_version: '0'
  }
]

/** 系统短信消息日志 Mock 数据 */
export const mockMessageLogData: SysMessageLog[] = [
  {
    message_id: '2069971873545981952',
    template_id: '10028395',
    phone: '18588586178',
    content: '18588586178|888777',
    req_headers: '{"x-tsp-signature":"DB40F129651F15169876AA63EF8124A72A73268E8FF0AB95F6F1F9B50F7CF986","x-tsp-paasid":"1654768158265397249","x-tsp-nonce":"8851943dbace47bdbb4a2a6e82eb47a5","x-tsp-timestamp":1782354726,"x-tsp-AppSecret":"18fcb814b7ab437d9052e75480381b0f","x-tsp-serviceid":"GDEM_14819631020424970251"}',
    reply_text: '{"code":200,"message":"成功","success":true,"data":{"msg":"发送短信失败！","res":"300","success":false,"respdata":{"records":[{"codeDesc":"模板不存在或模板未审批通过","code":"3002","msgId":"e65d047bd4e74d10a48c3645d5fc5ef2"}]}},"timestamp":"1782354727112"}',
    status: 1101,
    display_order: 0,
    creater: '',
    updater: '',
    remark: '',
    signature: '',
    signature_version: '0',
    create_time: '2026-06-25 10:32:07'
  },
  {
    message_id: '2069971873545981953',
    template_id: '10028395',
    phone: '13812345678',
    content: '13812345678|123456',
    req_headers: '{"x-tsp-signature":"A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6","x-tsp-paasid":"1654768158265397249","x-tsp-nonce":"a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6","x-tsp-timestamp":1782354800,"x-tsp-AppSecret":"18fcb814b7ab437d9052e75480381b0f","x-tsp-serviceid":"GDEM_14819631020424970251"}',
    reply_text: '{"code":200,"message":"成功","success":true,"data":{"msg":"发送成功","res":"0","success":true,"respdata":{"records":[{"codeDesc":"发送成功","code":"0","msgId":"f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2"}]}},"timestamp":"1782354801"}',
    status: 1101,
    display_order: 0,
    creater: '',
    updater: '',
    remark: '',
    signature: '',
    signature_version: '0',
    create_time: '2026-06-25 10:35:22'
  },
  {
    message_id: '2069971873545981954',
    template_id: '10028396',
    phone: '13987654321',
    content: '13987654321|654321',
    req_headers: '{"x-tsp-signature":"B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A1","x-tsp-paasid":"1654768158265397249","x-tsp-nonce":"b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7","x-tsp-timestamp":1782354900,"x-tsp-AppSecret":"18fcb814b7ab437d9052e75480381b0f","x-tsp-serviceid":"GDEM_14819631020424970251"}',
    reply_text: '{"code":200,"message":"成功","success":true,"data":{"msg":"发送短信失败！","res":"300","success":false,"respdata":{"records":[{"codeDesc":"模板不存在或模板未审批通过","code":"3002","msgId":"g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3"}]}},"timestamp":"1782354901"}',
    status: 1101,
    display_order: 0,
    creater: '',
    updater: '',
    remark: '',
    signature: '',
    signature_version: '0',
    create_time: '2026-06-25 11:00:15'
  },
  {
    message_id: '2069971873545981955',
    template_id: '10028395',
    phone: '15012345678',
    content: '15012345678|789012',
    req_headers: '{"x-tsp-signature":"C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A1B2","x-tsp-paasid":"1654768158265397249","x-tsp-nonce":"c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8","x-tsp-timestamp":1782355000,"x-tsp-AppSecret":"18fcb814b7ab437d9052e75480381b0f","x-tsp-serviceid":"GDEM_14819631020424970251"}',
    reply_text: '{"code":200,"message":"成功","success":true,"data":{"msg":"发送成功","res":"0","success":true,"respdata":{"records":[{"codeDesc":"发送成功","code":"0","msgId":"h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4"}]}},"timestamp":"1782355001"}',
    status: 1101,
    display_order: 0,
    creater: '',
    updater: '',
    remark: '',
    signature: '',
    signature_version: '0',
    create_time: '2026-06-25 11:15:30'
  },
  {
    message_id: '2069971873545981956',
    template_id: '10028397',
    phone: '18612345678',
    content: '18612345678|345678',
    req_headers: '{"x-tsp-signature":"D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A1B2C3","x-tsp-paasid":"1654768158265397249","x-tsp-nonce":"d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9","x-tsp-timestamp":1782355100,"x-tsp-AppSecret":"18fcb814b7ab437d9052e75480381b0f","x-tsp-serviceid":"GDEM_14819631020424970251"}',
    reply_text: '{"code":200,"message":"成功","success":true,"data":{"msg":"发送短信失败！","res":"300","success":false,"respdata":{"records":[{"codeDesc":"手机号格式错误","code":"1001","msgId":"i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5"}]}},"timestamp":"1782355101"}',
    status: 1101,
    display_order: 0,
    creater: '',
    updater: '',
    remark: '',
    signature: '',
    signature_version: '0',
    create_time: '2026-06-25 11:30:45'
  },
  {
    message_id: '2069971873545981957',
    template_id: '10028395',
    phone: '13512345678',
    content: '13512345678|901234',
    req_headers: '{"x-tsp-signature":"E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A1B2C3D4","x-tsp-paasid":"1654768158265397249","x-tsp-nonce":"e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0","x-tsp-timestamp":1782355200,"x-tsp-AppSecret":"18fcb814b7ab437d9052e75480381b0f","x-tsp-serviceid":"GDEM_14819631020424970251"}',
    reply_text: '{"code":200,"message":"成功","success":true,"data":{"msg":"发送成功","res":"0","success":true,"respdata":{"records":[{"codeDesc":"发送成功","code":"0","msgId":"j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6"}]}},"timestamp":"1782355201"}',
    status: 1101,
    display_order: 0,
    creater: '',
    updater: '',
    remark: '',
    signature: '',
    signature_version: '0',
    create_time: '2026-06-25 12:00:00'
  },
  {
    message_id: '2069971873545981958',
    template_id: '10028395',
    phone: '13712345678',
    content: '13712345678|567890',
    req_headers: '{"x-tsp-signature":"F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A1B2C3D4E5","x-tsp-paasid":"1654768158265397249","x-tsp-nonce":"f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1","x-tsp-timestamp":1782355300,"x-tsp-AppSecret":"18fcb814b7ab437d9052e75480381b0f","x-tsp-serviceid":"GDEM_14819631020424970251"}',
    reply_text: '{"code":200,"message":"成功","success":true,"data":{"msg":"发送成功","res":"0","success":true,"respdata":{"records":[{"codeDesc":"发送成功","code":"0","msgId":"k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7"}]}},"timestamp":"1782355301"}',
    status: 1101,
    display_order: 0,
    creater: '',
    updater: '',
    remark: '',
    signature: '',
    signature_version: '0',
    create_time: '2026-06-25 12:30:15'
  },
  {
    message_id: '2069971873545981959',
    template_id: '10028398',
    phone: '13912345678',
    content: '13912345678|112233',
    req_headers: '{"x-tsp-signature":"G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A1B2C3D4E5F6","x-tsp-paasid":"1654768158265397249","x-tsp-nonce":"g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2","x-tsp-timestamp":1782355400,"x-tsp-AppSecret":"18fcb814b7ab437d9052e75480381b0f","x-tsp-serviceid":"GDEM_14819631020424970251"}',
    reply_text: '{"code":200,"message":"成功","success":true,"data":{"msg":"发送短信失败！","res":"300","success":false,"respdata":{"records":[{"codeDesc":"模板不存在或模板未审批通过","code":"3002","msgId":"l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8"}]}},"timestamp":"1782355401"}',
    status: 1101,
    display_order: 0,
    creater: '',
    updater: '',
    remark: '',
    signature: '',
    signature_version: '0',
    create_time: '2026-06-25 13:00:30'
  }
]

/** 系统接口请求日志 Mock 数据 */
export const mockHttpLogData: SysHttpLog[] = [
  {
    id: '2079116512303648768',
    org_id: 0,
    req_method: 'POST_FORM',
    req_url: 'http://43.138.8.186:8092/freshet/auth/getAccessToken',
    req_params: '{"appKey":"d452018f84db4f56bcc008e3abb0a79e","appSecret":"nTEbMJY2bNErln2SSZMrqg=="}',
    rep_state: 'FAIL',
    rep_data: 'Failed to connect to /43.138.8.186:8092',
    rep_time: '43',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 16:09:39'
  },
  {
    id: '2079118158509248512',
    org_id: 0,
    req_method: 'GET',
    req_url: 'http://113.108.157.29:9084/mileagepile/kplies/v1?roadNo=G359&kilometerStake=K2&offset=0&coordinates=02',
    req_params: 'roadNo=G359&kilometerStake=K2&offset=0&coordinates=02',
    rep_state: 'SUCCESS',
    rep_data: '{"code":"0","message":"未匹配到里程桩","data":null}',
    rep_time: '13',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 16:16:11'
  },
  {
    id: '2073956004399288320',
    org_id: 0,
    req_method: 'POST_JSON',
    req_url: 'http://43.138.8.186:8092/freshet/receive/dailyInspectionData/endOrdinaryAdd',
    req_header: '{"Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOiI0NDAwMDAiLCJyb2xlSWQiOiI5NGE3NzZlMDYzNjk0YWRiYmNiNDRkNGI3YzQ3YTI5ZCIsImlkIjoiZjRjYmMxN2M2OWEyNDUyMjlmZDRlOWEzNzgwY2IwMzYiLCJleHAiOjE3ODMzODgxNzYsImlhdCI6MTc4MzMwMTQ3NiwiYWNjb3VudCI6IuW5v-S4nOmHjeeCueaZrumAmuWFrOi3ryJ9.Ei0kNMQV6TCXsW7MQfmQKBCkrHSyhfkrQWXUMnQyhJc"}',
    req_params: '{"InspectionDeviceType":"智能巡查车","InspectionAIcontent":[{"Stake":"10.20","InspectionTime":"2026-07-01 14:37:00","Type":"路面","ExceptionDescription":"路面湿滑","FileUrl":null}],"InspectionAllId":"2072207796170002432","RouteNumber":"G94","Recorder":"巡检员X01","InspectionDeviceId":"粤Axxxxxx","InspectionAlstime":"2026-07-01 14:36:53","EndStake":181.287,"ResponsiblePerson":"巡检员X01","StartingStake":143.116,"PatrolRoute":[],"RouteName":"肇花高速花都段","InspectionAllDirection":"上行","Id":"de433d2ed14e4dbbb5eca89cc3ec4f05","InspectionAletime":"2026-07-01 14:38:08"}',
    rep_state: 'SUCCESS',
    rep_data: '{"Success":true,"Data":"de433d2ed14e4dbbb5eca89cc3ec4f05"}',
    rep_time: '105',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-06 10:23:38'
  },
  {
    id: '2073956326026907648',
    org_id: 0,
    req_method: 'POST_JSON',
    req_url: 'http://43.138.8.186:8092/freshet/receive/dailyInspectionData/startOrdinaryAdd',
    req_header: '{"Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOiI0NDAwMDAiLCJyb2xlSWQiOiI5NGE3NzZlMDYzNjk0YWRiYmNiNDRkNGI3YzQ3YTI5ZCIsImlkIjoiZjRjYmMxN2M2OWEyNDUyMjlmZDRlOWEzNzgwY2IwMzYiLCJleHAiOjE3ODMzODgxNzYsImlhdCI6MTc4MzMwMTQ3NiwiYWNjb3VudCI6IuW5v-S4nOmHjeeCueaZrumAmuWFrOi3ryJ9.Ei0kNMQV6TCXsW7MQfmQKBCkrHSyhfkrQWXUMnQyhJc"}',
    req_params: '{"InspectionDeviceType":"智能巡查车","InspectionAlstime":"2026-06-30 17:37:05","ResponsiblePerson":"测试用户1","StartingStake":3427.0,"EstimatedEndStake":3427.0,"InspectionAllId":"2071890758234935296","RouteName":"大广高速","RouteNumber":"G45","InspectionAllDirection":"上行","Recorder":"测试用户1","InspectionDeviceId":"粤A123456"}',
    rep_state: 'SUCCESS',
    rep_data: '{"Success":true,"Data":"5ec0c0b79ab1429bad1a73c2047df74a"}',
    rep_time: '116',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-06 10:24:55'
  },
  {
    id: '2073956326580555776',
    org_id: 0,
    req_method: 'POST_JSON',
    req_url: 'http://43.138.8.186:8092/freshet/receive/dailyInspectionData/endOrdinaryAdd',
    req_header: '{"Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOiI0NDAwMDAiLCJyb2xlSWQiOiI5NGE3NzZlMDYzNjk0YWRiYmNiNDRkNGI3YzQ3YTI5ZCIsImlkIjoiZjRjYmMxN2M2OWEyNDUyMjlmZDRlOWEzNzgwY2IwMzYiLCJleHAiOjE3ODMzODgxNzYsImlhdCI6MTc4MzMwMTQ3NiwiYWNjb3VudCI6IuW5v-S4nOmHjeeCueaZrumAmuWFrOi3ryJ9.Ei0kNMQV6TCXsW7MQfmQKBCkrHSyhfkrQWXUMnQyhJc"}',
    req_params: '{"InspectionDeviceType":"智能巡查车","InspectionAIcontent":[],"InspectionAllId":"2071890758234935296","RouteNumber":"G45","Recorder":"测试用户1","InspectionDeviceId":"粤Axxxxxx","InspectionAlstime":"2026-06-30 17:37:05","EndStake":3427.0,"ResponsiblePerson":"测试用户1","StartingStake":3427.0,"PatrolRoute":[],"RouteName":"大广高速","InspectionAllDirection":"上行","Id":"5ec0c0b79ab1429bad1a73c2047df74a","InspectionAletime":"2026-06-30 17:38:43"}',
    rep_state: 'SUCCESS',
    rep_data: '{"Success":true,"Data":"5ec0c0b79ab1429bad1a73c2047df74a"}',
    rep_time: '109',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-06 10:24:55'
  },
  {
    id: '2073956500744835072',
    org_id: 0,
    req_method: 'POST_JSON',
    req_url: 'http://43.138.8.186:8092/freshet/receive/dailyInspectionData/startOrdinaryAdd',
    req_header: '{"Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOiI0NDAwMDAiLCJyb2xlSWQiOiI5NGE3NzZlMDYzNjk0YWRiYmNiNDRkNGI3YzQ3YTI5ZCIsImlkIjoiZjRjYmMxN2M2OWEyNDUyMjlmZDRlOWEzNzgwY2IwMzYiLCJleHAiOjE3ODMzODgxNzYsImlhdCI6MTc4MzMwMTQ3NiwiYWNjb3VudCI6IuW5v-S4nOmHjeeCueaZrumAmuWFrOi3ryJ9.Ei0kNMQV6TCXsW7MQfmQKBCkrHSyhfkrQWXUMnQyhJc"}',
    req_params: '{"InspectionDeviceType":"智能巡查车","InspectionAlstime":"2026-07-01 16:02:37","ResponsiblePerson":"林学宽","StartingStake":3397.3,"EstimatedEndStake":465.0,"InspectionAllId":"2072229375532732416","RouteName":"大广高速","RouteNumber":"G45","InspectionAllDirection":"上行","Recorder":"林学宽","InspectionDeviceId":"粤A123456"}',
    rep_state: 'SUCCESS',
    rep_data: '{"Success":true,"Data":"c984d26f8fb14ef8a49673a376c90b00"}',
    rep_time: '136',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-06 10:25:36'
  },
  {
    id: '2073956501290094592',
    org_id: 0,
    req_method: 'POST_JSON',
    req_url: 'http://43.138.8.186:8092/freshet/receive/dailyInspectionData/endOrdinaryAdd',
    req_header: '{"Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOiI0NDAwMDAiLCJyb2xlSWQiOiI5NGE3NzZlMDYzNjk0YWRiYmNiNDRkNGI3YzQ3YTI5ZCIsImlkIjoiZjRjYmMxN2M2OWEyNDUyMjlmZDRlOWEzNzgwY2IwMzYiLCJleHAiOjE3ODMzODgxNzYsImlhdCI6MTc4MzMwMTQ3NiwiYWNjb3VudCI6IuW5v-S4nOmHjeeCueaZrumAmuWFrOi3ryJ9.Ei0kNMQV6TCXsW7MQfmQKBCkrHSyhfkrQWXUMnQyhJc"}',
    req_params: '{"InspectionDeviceType":"智能巡查车","InspectionAIcontent":[],"InspectionAllId":"2072229375532732416","RouteNumber":"G45","Recorder":"林学宽","InspectionDeviceId":"粤Axxxxxx","InspectionAlstime":"2026-07-01 16:02:37","EndStake":465.0,"ResponsiblePerson":"林学宽","StartingStake":3397.3,"PatrolRoute":[],"RouteName":"大广高速","InspectionAllDirection":"上行","Id":"c984d26f8fb14ef8a49673a376c90b00","InspectionAletime":"2026-07-01 16:09:54"}',
    rep_state: 'SUCCESS',
    rep_data: '{"Success":true,"Data":"c984d26f8fb14ef8a49673a376c90b00"}',
    rep_time: '110',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-06 10:25:36'
  },
  {
    id: '2077671906672250880',
    org_id: 0,
    req_method: 'GET',
    req_url: 'http://113.108.157.29:9084/mileagepile/kplies/v1?roadNo=S238&kilometerStake=K123&offset=0&coordinates=02',
    req_params: 'roadNo=S238&kilometerStake=K123&offset=0&coordinates=02',
    rep_state: 'SUCCESS',
    rep_data: '{"code":"0","message":"未匹配到里程桩","data":null}',
    rep_time: '157',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-16 16:29:18'
  },
  {
    id: '2079037222279057408',
    org_id: 0,
    req_method: 'POST_FORM',
    req_url: 'http://43.138.8.186:8092/freshet/auth/getAccessToken',
    req_params: '{"appKey":"d452018f84db4f56bcc008e3abb0a79e","appSecret":"nTEbMJY2bNErln2SSZMrqg=="}',
    rep_state: 'FAIL',
    rep_data: 'Failed to connect to /43.138.8.186:8092',
    rep_time: '52',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 10:54:35'
  },
  {
    id: '2079037426235478016',
    org_id: 0,
    req_method: 'POST_FORM',
    req_url: 'http://43.138.8.186:8092/freshet/auth/getAccessToken',
    req_params: '{"appKey":"d452018f84db4f56bcc008e3abb0a79e","appSecret":"nTEbMJY2bNErln2SSZMrqg=="}',
    rep_state: 'FAIL',
    rep_data: 'Failed to connect to /43.138.8.186:8092',
    rep_time: '48',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 10:55:23'
  },
  {
    id: '2079037495152087040',
    org_id: 0,
    req_method: 'GET',
    req_url: 'http://113.108.157.29:9084/mileagepile/kplies/v1?roadNo=G321&kilometerStake=K1&offset=0&coordinates=02',
    req_params: 'roadNo=G321&kilometerStake=K1&offset=0&coordinates=02',
    rep_state: 'SUCCESS',
    rep_data: '{"code":"0","message":"未匹配到里程桩","data":null}',
    rep_time: '101',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 10:55:40'
  },
  {
    id: '2079049246631399424',
    org_id: 0,
    req_method: 'POST_FORM',
    req_url: 'http://43.138.8.186:8092/freshet/auth/getAccessToken',
    req_params: '{"appKey":"d452018f84db4f56bcc008e3abb0a79e","appSecret":"nTEbMJY2bNErln2SSZMrqg=="}',
    rep_state: 'FAIL',
    rep_data: 'Failed to connect to /43.138.8.186:8092',
    rep_time: '55',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 11:42:21'
  },
  {
    id: '2079115900350500864',
    org_id: 0,
    req_method: 'POST_FORM',
    req_url: 'http://43.138.8.186:8092/freshet/auth/getAccessToken',
    req_params: '{"appKey":"d452018f84db4f56bcc008e3abb0a79e","appSecret":"nTEbMJY2bNErln2SSZMrqg=="}',
    rep_state: 'FAIL',
    rep_data: 'Failed to connect to /43.138.8.186:8092',
    rep_time: '45',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 16:07:13'
  },
  {
    id: '2079115950707314688',
    org_id: 0,
    req_method: 'GET',
    req_url: 'http://113.108.157.29:9084/mileagepile/kplies/v1?roadNo=G359&kilometerStake=K2&offset=0&coordinates=02',
    req_params: 'roadNo=G359&kilometerStake=K2&offset=0&coordinates=02',
    rep_state: 'SUCCESS',
    rep_data: '{"code":"0","message":"未匹配到里程桩","data":null}',
    rep_time: '82',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 16:07:25'
  },
  {
    id: '2079116108362813440',
    org_id: 0,
    req_method: 'POST_FORM',
    req_url: 'http://43.138.8.186:8092/freshet/auth/getAccessToken',
    req_params: '{"appKey":"d452018f84db4f56bcc008e3abb0a79e","appSecret":"nTEbMJY2bNErln2SSZMrqg=="}',
    rep_state: 'FAIL',
    rep_data: 'Failed to connect to /43.138.8.186:8092',
    rep_time: '52',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 16:08:03'
  },
  {
    id: '2079116179032641536',
    org_id: 0,
    req_method: 'GET',
    req_url: 'http://113.108.157.29:9084/mileagepile/kplies/v1?roadNo=G236&kilometerStake=K32&offset=0&coordinates=02',
    req_params: 'roadNo=G236&kilometerStake=K32&offset=0&coordinates=02',
    rep_state: 'SUCCESS',
    rep_data: '{"code":"0","message":"未匹配到里程桩","data":null}',
    rep_time: '37',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 16:08:19'
  },
  {
    id: '2079116352345477120',
    org_id: 0,
    req_method: 'GET',
    req_url: 'http://113.108.157.29:9084/mileagepile/kplies/v1?roadNo=G321&kilometerStake=K1&offset=0&coordinates=02',
    req_params: 'roadNo=G321&kilometerStake=K1&offset=0&coordinates=02',
    rep_state: 'SUCCESS',
    rep_data: '{"code":"0","message":"未匹配到里程桩","data":null}',
    rep_time: '35',
    deleted: 0,
    signature_version: '1',
    create_time: '2026-07-20 16:09:01'
  }
]

/** 系统登录日志 Mock 数据 */
export const mockLoginLogData: SysLoginLog[] = [
  {
    log_id: '2077924072474394625',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-17 09:11:19',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2077924082897240065',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-17 09:11:21',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2077924099603152897',
    puser_id: '2076476259684192256',
    user_name: '2076476259684192256_2071600733559590912_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-17 09:11:25',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2078312027957346306',
    puser_id: '2061290146438975488',
    user_name: '2061290146438975488_2061293192824885255_inspector',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-18 10:52:55',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079010899511853057',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 09:09:59',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079010908420554754',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 09:10:01',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079023972331143169',
    puser_id: '2076476259684192256',
    user_name: '2076476259684192256_2071600733559590912_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 10:01:56',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079037089211596801',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 10:54:03',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079041108436959233',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 11:10:01',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079083698498682882',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 13:59:15',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079114258101157890',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 16:00:41',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079121758061969410',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 16:30:29',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079147721671950337',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-20 18:13:40',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079375298361655298',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 09:17:58',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079387544764645377',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:06:38',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079387561625747457',
    puser_id: '2076476259684192256',
    user_name: '2076476259684192256_2071600733559590912_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:06:42',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079391162859356162',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:21:01',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079391193188368385',
    puser_id: '2061290146438975488',
    user_name: '2061290146438975488_2061293192824885255_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:21:08',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079392317765156866',
    puser_id: '2076476259684192256',
    user_name: '2076476259684192256_2074341855671226368_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:25:36',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079393578317086722',
    puser_id: '2076476259684192256',
    user_name: '2076476259684192256_2074341855671226368_inspector',
    client_id: 'flood-inspection',
    grant_type: 'mobile',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:30:36',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079394131621281793',


    client_id: 'flood-inspection',
    grant_type: 'refresh_token',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:32:48',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079394170892550145',
    puser_id: '2061290765434359808',
    user_name: '2061290765434359808_2061293192824885255_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:32:58',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079396263586004994',
    puser_id: '2061290765434359808',
    user_name: '2061290765434359808_2061293192824885255_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 10:41:17',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079404322400075777',
    puser_id: '2061290765434359808',
    user_name: '2061290765434359808_2061293192824885255_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 11:13:18',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079409018451886082',
    puser_id: '2076476259684192256',
    user_name: '2076476259684192256_2074341855671226368_admin',
    client_id: 'flood-inspection',
    grant_type: 'password',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 11:31:58',
    deleted: 0,
    signature_version: '1'
  },
  {
    log_id: '2079409169702682626',
    puser_id: '2076476259684192256',
    user_name: '2076476259684192256_2071785459255742464_inspector',
    client_id: 'flood-inspection',
    grant_type: 'mobile',
    ip: '10.0.71.95',
    browser: 'Robot/Spider',
    os: 'Unknown',
    operation_type: 1,
    create_time: '2026-07-21 11:32:34',
    deleted: 0,
    signature_version: '1'
  }
]
