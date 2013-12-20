<?php

class Film implements JsonSerializable {

    private $id;
    private $titel;
    private $beschrijving;
	private $genre;
	private $duur;
	private $regisseur;
	private $release;
	private $foto;

    
    
    public function __construct($id, $titel, $beschrijving, $genre, $duur, $regisseur, $release, $foto) {    
		$this->id 			= $id;
		$this->titel 		= $titel;
		$this->beschrijving = $beschrijving;
		$this->genre 		= $genre;
		$this->duur 		= $duur;
		$this->regisseur 	= $regisseur;
		$this->release 		= $release;
		$this->foto 		= $foto;
    }

    public function getId() {
        return $this->id;
    }

    public function getTitel() {
        return $this->titel;
    }
    public function getBeschrijving() {
        return $this->beschrijving;
    }
 	public function getGenre() {
        return $this->genre;
    } 
	public function getDuur() {
        return $this->duur;
    } 
	public function getRegisseur() {
        return $this->regisseur;
    } 
	public function getFoto() {
        return $this->foto;
    } 
	public function getRelease() {
        return $this->release;
    }
  
    
    public function jsonSerialize() {
        return get_object_vars($this);
    }

}

?>
