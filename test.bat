REG ADD HKEY_CLASSES_ROOT\cryptoarm /f
Reg Add "HKCR\cryptoarm" /v "URL Protocol" /t REG_SZ /f

Reg Add "HKCR\cryptoarm\shell" /f

Reg Add "HKCR\cryptoarm\shell\open" /f

Reg Add "HKCR\cryptoarm\shell\open\command" /f

Reg Add "HKCR\cryptoarm\shell\open\command" /ve /d "c:\Program Files\CryptoARM GOST\CryptoARM_GOST.exe" /f
