import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/order/list',
    method: 'post',
    data
  })
}

export function getDetail(params) {
  return request({
    url: '/admin/order/one',
    method: 'get',
    params
  })
}

export function refund(params) {
  return request({
    url: '/admin/order/refund',
    method: 'get',
    params
  })
}
