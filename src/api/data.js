import axios from '@/libs/api.request'

export const getLiveSummaryInfo = () => {
  let data = {}
  return axios.request({
    url: 'index/getLiveSummaryInfo.do',
    data,
    method: 'post'
  })
}

export const getAccount = data => {
  return axios.request({
    url: 'console/getAccountPage.do',
    data,
    method: 'post'
  })
}

export const stopAccount = data => {
  return axios.request({
    url: 'console/stopAccount.do',
    data,
    method: 'post'
  })
}

export const startAccount = data => {
  return axios.request({
    url: 'console/startAccount.do',
    data,
    method: 'post'
  })
}

export const delAccount = data => {
  return axios.request({
    url: 'console/delAccount.do',
    data,
    method: 'post'
  })
}

export const addAccount = data => {
  return axios.request({
    url: 'console/addAccount.do',
    data,
    method: 'post'
  })
}

export const modifyAccount = data => {
  return axios.request({
    url: 'console/modifyAccount.do',
    data,
    method: 'post'
  })
}

export const getDevicePage = data => {
  return axios.request({
    url: 'console/getDevicePage.do',
    data,
    method: 'post'
  })
}

export const delDevice = data => {
  return axios.request({
    url: 'console/delDevice.do',
    data,
    method: 'post'
  })
}

export const addDevice = data => {
  return axios.request({
    url: 'console/addDevice.do',
    data,
    method: 'post'
  })
}

export const modifyDevice = data => {
  return axios.request({
    url: 'console/modifyDevice.do',
    data,
    method: 'post'
  })
}

export const getChannelPage = data => {
  return axios.request({
    url: 'console/getChannelPage.do',
    data,
    method: 'post'
  })
}

export const addChannel = data => {
  return axios.request({
    url: '/console/addChannel.do',
    data,
    method: 'post'
  })
}

export const delChannel = data => {
  return axios.request({
    url: '/console/delChannel.do',
    data,
    method: 'post'
  })
}

export const startChannel = data => {
  return axios.request({
    url: '/console/startChannel.do',
    data,
    method: 'post'
  })
}

export const stopChannel = data => {
  return axios.request({
    url: '/console/stopChannel.do',
    data,
    method: 'post'
  })
}

export const showChannelControlDetail = data => {
  return axios.request({
    url: '/console/showChannelControlDetail.do',
    data,
    method: 'post'
  })
}

export const getSpecialPage = data => {
  return axios.request({
    url: '/console/getSpecialPage.do',
    data,
    method: 'post'
  })
}

export const addSpecial = data => {
  return axios.request({
    url: '/console/addSpecial.do',
    data,
    method: 'post'
  })
}

export const delSpecial = data => {
  return axios.request({
    url: '/console/delSpecial.do',
    data,
    method: 'post'
  })
}

export const getSignature = data => {
  return axios.request({
    url: '/console/getSignature.do',
    data,
    method: 'post'
  })
}

export const addPlayback = data => {
  return axios.request({
    url: '/console/addPlayback.do',
    data,
    method: 'post'
  })
}

export const channel_playback_list = data => {
  return axios.request({
    url: '/console/channel_playback_list.do',
    data,
    method: 'post'
  })
}

export const batchDelPlayback = data => {
  return axios.request({
    url: '/console/batchDelPlayback.do',
    data,
    method: 'post'
  })
}

export const playback_clip = data => {
  return axios.request({
    url: '/console/playback_clip.do',
    data,
    method: 'post'
  })
}

export const clipPlayback = data => {
  return axios.request({
    url: '/console/clipPlayback.do',
    data,
    method: 'post'
  })
}

export const concatPlayback = data => {
  return axios.request({
    url: '/console/concatPlayback.do',
    data,
    method: 'post'
  })
}

export const modPlayback = data => {
  return axios.request({
    url: '/console/modPlayback.do',
    data,
    method: 'post'
  })
}

export const transcode = data => {
  return axios.request({
    url: '/console/transcode.do',
    data,
    method: 'post'
  })
}

export const getChannelLiveSummary = data => {
  return axios.request({
    url: '/console/getChannelLiveSummary.do',
    data,
    method: 'post'
  })
}

export const getChartAnalyseInfo = data => {
  return axios.request({
    url: '/console/getChartAnalyseInfo.do',
    data,
    method: 'post'
  })
}

export const sendVerifiCode = data => {
  return axios.request({
    url: '/console/sendVerifiCode.do',
    data,
    method: 'post'
  })
}

export const registerByTel = data => {
  return axios.request({
    url: '/console/registerByTel.do',
    data,
    method: 'post'
  })
}

export const modifyChannel = data => {
  return axios.request({
    url: '/console/modifyChannel.do',
    data,
    method: 'post'
  })
}

export const getTEL = data => {
  return axios.request({
    url: '/console/getTEL.do',
    data,
    method: 'post'
  })
}

export const forgetPassword = data => {
  return axios.request({
    url: '/console/forgetPassword.do',
    data,
    method: 'post'
  })
}

export const modifyPassword = data => {
  return axios.request({
    url: '/console/modifyPassword.do',
    data,
    method: 'post'
  })
}

export const getVersionList = data => {
  return axios.request({
    url: '/console/getVersionList.do',
    data,
    method: 'post'
  })
}

export const addVersion = data => {
  return axios.request({
    url: '/console/addVersion.do',
    data,
    method: 'post'
  })
}

export const delVersion = data => {
  return axios.request({
    url: '/console/delVersion.do',
    data,
    method: 'post'
  })
}



// export const getTableData = () => {
//   return axios.request({
//     url: 'get_table_data',
//     method: 'get'
//   })
// }

// export const getDragList = () => {
//   return axios.request({
//     url: 'get_drag_list',
//     method: 'get'
//   })
// }

// export const errorReq = () => {
//   return axios.request({
//     url: 'error_url',
//     method: 'post'
//   })
// }

// export const saveErrorLogger = info => {
//   return axios.request({
//     url: 'save_error_logger',
//     data: info,
//     method: 'post'
//   })
// }

// export const uploadImg = formData => {
//   return axios.request({
//     url: 'image/upload',
//     data: formData
//   })
// }

// export const getOrgData = () => {
//   return axios.request({
//     url: 'get_org_data',
//     method: 'get'
//   })
// }

// export const getTreeSelectData = () => {
//   return axios.request({
//     url: 'get_tree_select_data',
//     method: 'get'
//   })
// }
