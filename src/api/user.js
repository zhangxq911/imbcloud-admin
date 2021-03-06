import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    access_key_id: userName,
    access_key_secret: password
  }
  return axios.request({
    url: 'console/doLogin.do',
    data,
    method: 'post'
  })
}

export const ailogin = ({ userName, password }) => {
  const data = {
    account: userName,
    password: password
  }
  return axios.request({
    url: 'console/doAiLogin.do',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const getAccount = data => {
  return axios.request({
    url: 'console/getAccount.do',
    method: 'get',
    headers: {
      'token': data
    }
  })
}
