interface HeaderProps {
  title: string
  text?: string
}

function Header({ title, text }: HeaderProps) {
  return (
    <>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </>
  )
}

export default Header
