const directive = {
  has: {
    inserted: hasPermission,
    update: hasPermission,
  },
}

function hasPermission(el, binding) {
  let {
    value: [that, args],
  } = binding

  const has = Array.isArray(args) ? that.$route.meta.has(...args) : that.$route.meta.has(args)

  if (!has) {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

export default directive
