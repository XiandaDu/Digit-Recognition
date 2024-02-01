
const Welcome = () => {
    return (
        <div>
          <h1 className='head-text'>
            Try out the
            <span className='blue-gradient_text font-semibold drop-shadow'>
              {" "}
              Digit Recognition
            </span>
          </h1>

          <div className='mt-5 flex flex-col gap-3 text-slate-500'>
            <p>
              Write on the 28px * 28px canvas, and it will call a CNN in python to recognize what the digit you are writing!!
            </p>
          </div>
        </div>
    )
}

export default Welcome