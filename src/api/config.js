import request from '@/utils/request'

export function getConfig(params) {
  return request({
    url: '/admin/config/get-config',
    method: 'get',
    params
  })
}

export function setConfig(data) {
  return request({
    url: '/admin/config/set-config',
    method: 'post',
    data
  })
}
