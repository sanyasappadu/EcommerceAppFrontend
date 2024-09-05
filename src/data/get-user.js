

export const getUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if(token) return { success: token };
    return { error: 'You not authrrized'}
  } catch (error) {
    throw new Error("Something went wrongsss")
  }
}