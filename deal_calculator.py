# Deal Calculator - L Chain Tools
# Berekent je marge op een iPhone deal

# Vul hier je getallen in
inkoop_prijs = 423.89
reparatie_kosten = 157.26
verkoop_prijs = 660

# Berekening
totale_kosten = inkoop_prijs + reparatie_kosten
winst = verkoop_prijs - totale_kosten
marge_procent = (winst / verkoop_prijs) * 100

# Resultaat tonen
print("=== Deal Berekening ===")
print(f"Inkoopprijs:      €{inkoop_prijs}")
print(f"Reparatie:        €{reparatie_kosten}")
print(f"Verkoopprijs:     €{verkoop_prijs}")
print(f"Totale kosten:    €{totale_kosten}")
print(f"Winst:            €{winst:.2f}")
print(f"Marge:            {marge_procent:.1f}%")
