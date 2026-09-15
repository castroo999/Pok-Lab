import "./OptionJogos.css";

export default function Jogos() {
  return (
    <div className="jogos">
      <select>
        <option value="FireRed">FireRed</option>
        <option value="LeafGreen">LeafGreen</option>
        <option value="Emerald">Emerald</option>
        <option value="Diamond">Diamond</option>
        <option value="Pearl">Pearl</option>
        <option value="Platinum">Platinum</option>
        <option value="HeartGold">HeartGold</option>
        <option value="SoulSilver">SoulSilver</option>
        <option value="Black">Black</option>
        <option value="White">White</option>
        <option value="Black 2">Black 2</option>
        <option value="White 2">White 2</option>
        <option value="X">Pokémon X</option>
        <option value="Y">Pokémon Y</option>
        <option value="Omega Ruby">Omega Ruby</option>
        <option value="Alpha Sapphire">Alpha Sapphire</option>
        <option value="Sun">Sun</option>
        <option value="Moon">Moon</option>
        <option value="Ultra Sun">Ultra Sun</option>
        <option value="Ultra Moon">Ultra Moon</option>
        <option value="Sword">Sword</option>
        <option value="Shield">Shield</option>
        <option value="Legends Arceus">Legends Arceus</option>
        <option value="Scarlet">Scarlet</option>
        <option value="Violet">Violet</option>
        <option value="Legends Z-A">Legends Z-A</option>
      </select>

      <div className="opcoes">
        <h2>Qual seu objetivo no jogo?</h2>

        <label>
          <input type="radio" name="grupo" value="opcao1" />
          Speed run
        </label>

        <label>
          <input type="radio" name="grupo" value="opcao2" />
          Platinar
        </label>

        <label>
          <input type="radio" name="grupo" value="opcao3" />
          Otimização de tipos
        </label>

        <label>
          <input type="radio" name="grupo" value="opcao4" />
          Aleatório (geramos um time aleatório para aumentar sua dificuldade)
        </label>
      </div>

      <button className="montar">Montar time</button>
    </div>
  );
}
