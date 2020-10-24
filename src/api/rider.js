import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/courier/list',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/admin/courier/update-status',
    method: 'post',
    data
  })
}
