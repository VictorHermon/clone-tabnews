function status(request, response) {
  response.status(200).json({chave: "Página de status"})
}

export default status
